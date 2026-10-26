// Electrical Circuit Simulation Engine - Virtual Lab IPL

import { COMPONENT_TYPES } from '../components/SVGAssets.js';

// Indonesian human-readable names for components
export const COMPONENT_NAME_MAP = {
  'Lamp': 'Lampu',
  'LampTL': 'Lampu TL',
  'SwitchSingle': 'Saklar Tunggal',
  'SwitchDouble': 'Saklar Seri',
  'SwitchWay3': 'Saklar Tukar',
  'SwitchCross': 'Saklar Silang',
  'Socket': 'Stop Kontak',
  'MCB_1P': 'MCB 1-Fasa',
  'MCB_3P': 'MCB 3-Fasa',
  'Source_1P': 'Sumber Listrik 1-Fasa',
  'Source_3P': 'Sumber Listrik 3-Fasa',
  'Fuse': 'Sekring',
  'TerminalBlock': 'Terminal Block',
  'JunctionBox': 'Kotak Sambung'
};

/**
 * Generate human-friendly component label based on position order of same component type
 * e.g. "Lampu #1", "Lampu #2", "Saklar Tunggal #1"
 */
export function getComponentLabel(comp, allComponents = []) {
  if (!comp) return 'Komponen';
  const baseName = COMPONENT_NAME_MAP[comp.type] || comp.type || 'Komponen';
  
  if (!allComponents || allComponents.length === 0) {
    return baseName;
  }
  
  const sameTypeComponents = allComponents.filter(c => c.type === comp.type);
  const idx = sameTypeComponents.findIndex(c => c.id === comp.id);
  
  if (idx !== -1) {
    return `${baseName} #${idx + 1}`;
  }
  return baseName;
}

/**
 * Generate human-friendly wire label describing its connected endpoints
 * e.g. "Kabel dari Saklar Tunggal #1 ke Lampu #2"
 */
export function getWireLabel(wire, allComponents = []) {
  if (!wire) return 'Kabel';
  
  function formatEndpoint(endpoint) {
    if (!endpoint) return 'Ujung Terbuka';
    if (endpoint.type === 'pin') {
      const comp = allComponents.find(c => c.id === endpoint.componentId);
      return comp ? getComponentLabel(comp, allComponents) : 'Komponen';
    } else if (endpoint.type === 'wire') {
      return 'Percabangan';
    }
    return 'Ujung Terbuka';
  }

  const fromIsPin = wire.from && wire.from.type === 'pin';
  const toIsPin = wire.to && wire.to.type === 'pin';
  const fromIsWire = wire.from && wire.from.type === 'wire';
  const toIsWire = wire.to && wire.to.type === 'wire';

  if (fromIsWire && toIsWire) {
    return 'Kabel Percabangan';
  }

  const fromLabel = formatEndpoint(wire.from);
  const toLabel = formatEndpoint(wire.to);

  if (fromIsPin && toIsPin) {
    return `Kabel dari ${fromLabel} ke ${toLabel}`;
  }
  if (fromIsPin && toIsWire) {
    return `Kabel dari ${fromLabel} ke Percabangan`;
  }
  if (fromIsWire && toIsPin) {
    return `Kabel dari Percabangan ke ${toLabel}`;
  }
  if (wire.from && wire.from.type) {
    return `Kabel dari ${fromLabel} (terbuka)`;
  }
  if (wire.to && wire.to.type) {
    return `Kabel menuju ${toLabel} (terbuka)`;
  }
  return 'Kabel Penghubung';
}

// DSU (Disjoint Set Union) class for finding connected nodes
class UnionFind {
  constructor() {
    this.parent = {};
  }

  find(i) {
    if (this.parent[i] === undefined) {
      this.parent[i] = i;
      return i;
    }
    if (this.parent[i] === i) {
      return i;
    }
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
    }
  }

  getGroups() {
    const groups = {};
    for (const node of Object.keys(this.parent)) {
      const root = this.find(node);
      if (!groups[root]) {
        groups[root] = [];
      }
      groups[root].push(node);
    }
    return groups;
  }
}

// Helper to get a stable string ID for wire endpoints
function getEndpointId(endpoint) {
  if (!endpoint) return `unknown_${Math.random()}`;
  if (endpoint.type === 'pin') {
    return `${endpoint.componentId}_${endpoint.pinName}`;
  } else if (endpoint.type === 'wire') {
    const wpKey = endpoint.waypointId !== undefined
      ? `${endpoint.wireId}_wp_${endpoint.waypointId}`
      : `${endpoint.wireId}_wp_${endpoint.waypointIndex}`;
    return wpKey;
  } else if (endpoint.type === 'point') {
    return `point_${endpoint.x}_${endpoint.y}_${endpoint.id || Math.random()}`;
  }
  return `unknown_${Math.random()}`;
}

// Helper to parse component and pin name from graph node string e.g. "comp_lamp_1_L"
function parseCompNode(nodeStr, components) {
  if (!nodeStr || !nodeStr.startsWith('comp_')) return null;
  const rest = nodeStr.slice(5); // strip 'comp_'
  for (const comp of components) {
    if (rest.startsWith(comp.id + '_')) {
      const pinName = rest.slice(comp.id.length + 1);
      return { comp, compId: comp.id, pinName };
    }
  }
  return null;
}

// Natural role classification of terminal pins in PUIL standards
function isFasaPin(comp, pinName) {
  if (!comp) return false;
  if (comp.type === 'Source_1P' && pinName === 'L') return true;
  if (comp.type === 'Source_3P' && (pinName === 'R' || pinName === 'S' || pinName === 'T')) return true;
  if (comp.type === 'MCB_1P' || comp.type === 'MCB_3P' || comp.type === 'Fuse') return true;
  if (comp.type === 'SwitchSingle' || comp.type === 'SwitchDouble' || comp.type === 'SwitchWay3' || comp.type === 'SwitchCross') return true;
  if ((comp.type === 'Lamp' || comp.type === 'LampTL') && pinName === 'L') return true;
  if (comp.type === 'Socket' && pinName === 'L') return true;
  return false;
}

function isNetralPin(comp, pinName) {
  if (!comp) return false;
  if (comp.type === 'Source_1P' && pinName === 'N') return true;
  if (comp.type === 'Source_3P' && pinName === 'N') return true;
  if ((comp.type === 'Lamp' || comp.type === 'LampTL') && pinName === 'N') return true;
  if (comp.type === 'Socket' && pinName === 'N') return true;
  return false;
}

function isGroundPin(comp, pinName) {
  if (!comp) return false;
  if (pinName === 'PE') return true;
  return false;
}

/**
 * Path-finding algorithm to precisely identify the illegal wire bridge that causes short circuit
 * Returns { locationText, relatedIds, reason }
 */
function findShortCircuitBridge(components, wires, shortCircuitType) {
  // 1. Build adjacency graph (nodes = component pins & wire waypoints)
  const graph = {};
  function addEdge(u, v, data) {
    if (!graph[u]) graph[u] = [];
    if (!graph[v]) graph[v] = [];
    graph[u].push({ neighbor: v, ...data });
    graph[v].push({ neighbor: u, ...data });
  }

  // Add wire edges
  wires.forEach(wire => {
    const u = wire.from && wire.from.type === 'pin' 
      ? `comp_${wire.from.componentId}_${wire.from.pinName}`
      : (wire.from && wire.from.type === 'wire'
          ? `wire_${wire.from.wireId}_wp_${wire.from.waypointId !== undefined ? wire.from.waypointId : wire.from.waypointIndex}`
          : `wire_${wire.id}_open_u`);

    const v = wire.to && wire.to.type === 'pin'
      ? `comp_${wire.to.componentId}_${wire.to.pinName}`
      : (wire.to && wire.to.type === 'wire'
          ? `wire_${wire.to.wireId}_wp_${wire.to.waypointId !== undefined ? wire.to.waypointId : wire.to.waypointIndex}`
          : `wire_${wire.id}_open_v`);

    if (wire.path && wire.path.length > 0) {
      let prev = u;
      wire.path.forEach((wp, idx) => {
        const wpKey = `wire_${wire.id}_wp_${wp.id !== undefined ? wp.id : idx}`;
        addEdge(prev, wpKey, { wireId: wire.id, isWire: true });
        prev = wpKey;
      });
      addEdge(prev, v, { wireId: wire.id, isWire: true });
    } else {
      addEdge(u, v, { wireId: wire.id, isWire: true });
    }
  });

  // Add component closed internal paths (MCBs, Fuses, Switches, TerminalBlocks, JunctionBoxes)
  components.forEach(comp => {
    const s = comp.state || {};
    switch (comp.type) {
      case 'MCB_1P':
        if (s.on && !s.tripped) {
          addEdge(`comp_${comp.id}_in`, `comp_${comp.id}_out`, { compId: comp.id, isInternal: true });
        }
        break;
      case 'MCB_3P':
        if (s.on) {
          addEdge(`comp_${comp.id}_in_R`, `comp_${comp.id}_out_R`, { compId: comp.id, isInternal: true });
          addEdge(`comp_${comp.id}_in_S`, `comp_${comp.id}_out_S`, { compId: comp.id, isInternal: true });
          addEdge(`comp_${comp.id}_in_T`, `comp_${comp.id}_out_T`, { compId: comp.id, isInternal: true });
        }
        break;
      case 'PanelPHB':
        // Netral & PE selalu tersambung langsung (bus bar, tidak melewati pemutus)
        addEdge(`comp_${comp.id}_in_N`, `comp_${comp.id}_out_N`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_in_PE`, `comp_${comp.id}_out_PE`, { compId: comp.id, isInternal: true });

        if (s.mainOn && !s.mainTripped) {
          // Pengaman utama menyalurkan R, S, T ke bus internal
          if (s.group1On && !s.group1Tripped) addEdge(`comp_${comp.id}_in_R`, `comp_${comp.id}_out1_L`, { compId: comp.id, isInternal: true });
          if (s.group2On && !s.group2Tripped) addEdge(`comp_${comp.id}_in_S`, `comp_${comp.id}_out2_L`, { compId: comp.id, isInternal: true });
          if (s.group3On && !s.group3Tripped) addEdge(`comp_${comp.id}_in_T`, `comp_${comp.id}_out3_L`, { compId: comp.id, isInternal: true });
        }
        break;
      case 'Fuse':
        if (!s.blown) {
          addEdge(`comp_${comp.id}_in`, `comp_${comp.id}_out`, { compId: comp.id, isInternal: true });
        }
        break;
      case 'SwitchSingle':
        if (s.on) {
          addEdge(`comp_${comp.id}_in`, `comp_${comp.id}_out`, { compId: comp.id, isInternal: true });
        }
        break;
      case 'SwitchDouble':
        if (s.on1) addEdge(`comp_${comp.id}_in`, `comp_${comp.id}_out1`, { compId: comp.id, isInternal: true });
        if (s.on2) addEdge(`comp_${comp.id}_in`, `comp_${comp.id}_out2`, { compId: comp.id, isInternal: true });
        break;
      case 'SwitchWay3':
        if (s.on) addEdge(`comp_${comp.id}_com`, `comp_${comp.id}_L1`, { compId: comp.id, isInternal: true });
        else addEdge(`comp_${comp.id}_com`, `comp_${comp.id}_L2`, { compId: comp.id, isInternal: true });
        break;
      case 'SwitchCross':
        if (s.on) {
          addEdge(`comp_${comp.id}_in1`, `comp_${comp.id}_out2`, { compId: comp.id, isInternal: true });
          addEdge(`comp_${comp.id}_in2`, `comp_${comp.id}_out1`, { compId: comp.id, isInternal: true });
        } else {
          addEdge(`comp_${comp.id}_in1`, `comp_${comp.id}_out1`, { compId: comp.id, isInternal: true });
          addEdge(`comp_${comp.id}_in2`, `comp_${comp.id}_out2`, { compId: comp.id, isInternal: true });
        }
        break;
      case 'TerminalBlock':
        addEdge(`comp_${comp.id}_t1`, `comp_${comp.id}_b1`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_t2`, `comp_${comp.id}_b2`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_t3`, `comp_${comp.id}_b3`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_t4`, `comp_${comp.id}_b4`, { compId: comp.id, isInternal: true });
        break;
      case 'JunctionBox':
        addEdge(`comp_${comp.id}_top`, `comp_${comp.id}_bottom`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_top`, `comp_${comp.id}_left`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_top`, `comp_${comp.id}_right`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_bottom`, `comp_${comp.id}_left`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_bottom`, `comp_${comp.id}_right`, { compId: comp.id, isInternal: true });
        addEdge(`comp_${comp.id}_left`, `comp_${comp.id}_right`, { compId: comp.id, isInternal: true });
        break;
      default:
        // Lamps and Sockets are loads, they NEVER bridge L and N internally
        break;
    }
  });

  // 2. Determine start and target nodes for BFS
  const startNodes = [];
  const targetNodes = new Set();

  components.forEach(comp => {
    if (comp.type === 'Source_1P') {
      if (shortCircuitType === 'phase_netral' || shortCircuitType === 'phase_ground') {
        startNodes.push(`comp_${comp.id}_L`);
        if (shortCircuitType === 'phase_netral') targetNodes.add(`comp_${comp.id}_N`);
        if (shortCircuitType === 'phase_ground') targetNodes.add(`comp_${comp.id}_PE`);
      }
    } else if (comp.type === 'Source_3P') {
      if (shortCircuitType === 'phase_netral') {
        startNodes.push(`comp_${comp.id}_R`, `comp_${comp.id}_S`, `comp_${comp.id}_T`);
        targetNodes.add(`comp_${comp.id}_N`);
      } else if (shortCircuitType === 'phase_ground') {
        startNodes.push(`comp_${comp.id}_R`, `comp_${comp.id}_S`, `comp_${comp.id}_T`);
        targetNodes.add(`comp_${comp.id}_PE`);
      } else if (shortCircuitType === 'cross_phase') {
        startNodes.push(`comp_${comp.id}_R`);
        targetNodes.add(`comp_${comp.id}_S`);
        targetNodes.add(`comp_${comp.id}_T`);
      }
    }
  });

  // 3. BFS shortest path search
  const queue = [];
  const visited = new Set();
  const parentMap = {}; // node -> { prevNode, edgeData }

  for (const sNode of startNodes) {
    if (graph[sNode]) {
      queue.push(sNode);
      visited.add(sNode);
    }
  }

  let foundTarget = null;
  while (queue.length > 0) {
    const curr = queue.shift();
    if (targetNodes.has(curr)) {
      foundTarget = curr;
      break;
    }

    const neighbors = graph[curr] || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.neighbor)) {
        visited.add(edge.neighbor);
        parentMap[edge.neighbor] = { prevNode: curr, edgeData: edge };
        queue.push(edge.neighbor);
      }
    }
  }

  // 4. Reconstruct path and identify the illegal bridge
  if (foundTarget) {
    const pathNodes = [];
    const pathEdges = [];
    let curr = foundTarget;

    while (parentMap[curr]) {
      pathNodes.unshift(curr);
      pathEdges.unshift(parentMap[curr].edgeData);
      curr = parentMap[curr].prevNode;
    }
    pathNodes.unshift(curr); // Add start node

    // Parse all component pin nodes on the path
    const parsedPinNodes = [];
    pathNodes.forEach((node, idx) => {
      const parsed = parseCompNode(node, components);
      if (parsed) {
        parsedPinNodes.push({ ...parsed, pathIndex: idx });
      }
    });

    // Define boundary filters based on short circuit type
    function isSideAPin(comp, pinName) {
      if (shortCircuitType === 'cross_phase') {
        return (comp.type === 'Source_3P' && pinName === 'R') || isFasaPin(comp, pinName);
      }
      return isFasaPin(comp, pinName);
    }

    function isSideBPin(comp, pinName) {
      if (shortCircuitType === 'cross_phase') {
        return comp.type === 'Source_3P' && (pinName === 'S' || pinName === 'T');
      }
      if (shortCircuitType === 'phase_ground') {
        return isGroundPin(comp, pinName);
      }
      return isNetralPin(comp, pinName);
    }

    let lastAIdx = -1;
    let firstBIdx = -1;

    for (let i = 0; i < parsedPinNodes.length; i++) {
      const p = parsedPinNodes[i];
      if (isSideAPin(p.comp, p.pinName)) {
        lastAIdx = i;
      }
    }

    if (lastAIdx !== -1) {
      for (let i = lastAIdx + 1; i < parsedPinNodes.length; i++) {
        const p = parsedPinNodes[i];
        if (isSideBPin(p.comp, p.pinName)) {
          firstBIdx = i;
          break;
        }
      }
    }

    // If boundary pins are identified along the path:
    if (lastAIdx !== -1 && firstBIdx !== -1) {
      const pinAObj = parsedPinNodes[lastAIdx];
      const pinBObj = parsedPinNodes[firstBIdx];

      const edgeStart = pinAObj.pathIndex;
      const edgeEnd = pinBObj.pathIndex;

      // Collect wire IDs that bridge between pinA and pinB
      const bridgeWireIds = Array.from(new Set(
        pathEdges.slice(edgeStart, edgeEnd)
          .filter(e => e.wireId)
          .map(e => e.wireId)
      ));

      const compA = pinAObj.comp;
      const compB = pinBObj.comp;
      const pinA = pinAObj.pinName;
      const pinB = pinBObj.pinName;

      const compLabelA = getComponentLabel(compA, components);
      const compLabelB = getComponentLabel(compB, components);

      let locationText = '';
      let suffix = ' — jalur ini menghubungkan Fasa ke Netral tanpa melewati beban.';
      if (shortCircuitType === 'phase_ground') {
        suffix = ' — jalur ini menghubungkan Fasa langsung ke Ground/Arde.';
      } else if (shortCircuitType === 'cross_phase') {
        suffix = ' — jalur ini menghubungkan dua fasa berbeda (korsleting antarfasa).';
      }

      let relatedIds = [];
      if (compA.id === compB.id) {
        // Direct bridge on the same component (e.g. Lamp terminal L directly to terminal N)
        locationText = `Kabel dari ${compLabelA} (terminal ${pinA}) langsung ke ${compLabelA} (terminal ${pinB})${suffix}`;
        relatedIds = [...bridgeWireIds, compA.id];
      } else {
        if (bridgeWireIds.length <= 1) {
          locationText = `Kabel dari ${compLabelA} (terminal ${pinA}) langsung ke ${compLabelB} (terminal ${pinB})${suffix}`;
        } else {
          locationText = `Jalur kabel ${compLabelA} (terminal ${pinA}) → ${compLabelB} (terminal ${pinB}), sepanjang ${bridgeWireIds.length} kabel${suffix}`;
        }
        relatedIds = [...bridgeWireIds, compA.id, compB.id];
      }

      // Max 6 objects limit (as requested in rule 5)
      if (relatedIds.length > 6) {
        relatedIds = relatedIds.slice(0, 3);
        locationText += ' (memengaruhi beberapa bagian rangkaian)';
      }

      return {
        locationText,
        relatedIds,
        bridgeWireIds
      };
    }

    // If path was found but exact pins not isolated, use wires on path
    const pathWires = Array.from(new Set(pathEdges.filter(e => e.wireId).map(e => e.wireId)));
    if (pathWires.length > 0) {
      return {
        locationText: 'Jalur Kabel Fasa & Netral',
        relatedIds: pathWires.slice(0, 3),
        bridgeWireIds: pathWires.slice(0, 3)
      };
    }
  }

  // Graceful fallback
  const fallbackWireIds = wires.slice(0, 2).map(w => w.id);
  return {
    locationText: 'Jalur Kabel Fasa & Netral',
    relatedIds: fallbackWireIds,
    bridgeWireIds: fallbackWireIds
  };
}


export function evaluateCircuit(canvasState, options = {}) {
  const { components, wires } = canvasState;
  
  // 1. Initialize Union-Find DSU
  const uf = new UnionFind();
  
  // Connect all waypoints within each wire so the entire wire is conductive
  wires.forEach(wire => {
    const fromId = getEndpointId(wire.from);
    const toId = getEndpointId(wire.to);

    uf.union(fromId, toId);

    if (wire.path && wire.path.length > 0) {
      wire.path.forEach((wp, idx) => {
        const wpId = wp.id ? `${wire.id}_wp_${wp.id}` : `${wire.id}_wp_${idx}`;
        uf.union(fromId, wpId);
      });
    }
  });

  // 2. Identify all component terminal pins in DSU
  components.forEach(comp => {
    const typeInfo = COMPONENT_TYPES[comp.type];
    if (typeInfo && typeInfo.pins) {
      typeInfo.pins.forEach(pin => {
        const pinId = `${comp.id}_${pin.name}`;
        uf.find(pinId);
      });
    }
  });

  // 3. Gather DSU groups
  const pinToRoot = {};
  components.forEach(comp => {
    const typeInfo = COMPONENT_TYPES[comp.type];
    if (typeInfo && typeInfo.pins) {
      typeInfo.pins.forEach(pin => {
        const pinId = `${comp.id}_${pin.name}`;
        pinToRoot[pinId] = uf.find(pinId);
      });
    }
  });

  const wireEndpointToRoot = {};
  wires.forEach(wire => {
    const fromId = getEndpointId(wire.from);
    wireEndpointToRoot[wire.id] = uf.find(fromId);
  });

  // 4. Build components internal connection graph
  const adj = {};
  function addEdge(p1, p2) {
    const r1 = pinToRoot[p1];
    const r2 = pinToRoot[p2];
    if (r1 !== undefined && r2 !== undefined) {
      if (!adj[r1]) adj[r1] = new Set();
      if (!adj[r2]) adj[r2] = new Set();
      adj[r1].add(r2);
      adj[r2].add(r1);
    }
  }

  components.forEach(comp => {
    const state = comp.state || {};
    
    switch(comp.type) {
      case 'MCB_1P':
        if (state.on && !state.tripped) {
          addEdge(`${comp.id}_in`, `${comp.id}_out`);
        }
        break;
      case 'MCB_3P':
        if (state.on) {
          addEdge(`${comp.id}_in_R`, `${comp.id}_out_R`);
          addEdge(`${comp.id}_in_S`, `${comp.id}_out_S`);
          addEdge(`${comp.id}_in_T`, `${comp.id}_out_T`);
        }
        break;
      case 'PanelPHB':
        // Netral & PE selalu tersambung langsung (bus bar, tidak melewati pemutus)
        addEdge(`${comp.id}_in_N`, `${comp.id}_out_N`);
        addEdge(`${comp.id}_in_PE`, `${comp.id}_out_PE`);

        if (state.mainOn && !state.mainTripped) {
          // Pengaman utama menyalurkan R, S, T ke bus internal
          if (state.group1On && !state.group1Tripped) addEdge(`${comp.id}_in_R`, `${comp.id}_out1_L`);
          if (state.group2On && !state.group2Tripped) addEdge(`${comp.id}_in_S`, `${comp.id}_out2_L`);
          if (state.group3On && !state.group3Tripped) addEdge(`${comp.id}_in_T`, `${comp.id}_out3_L`);
        }
        break;
      case 'Fuse':
        if (!state.blown) {
          addEdge(`${comp.id}_in`, `${comp.id}_out`);
        }
        break;
      case 'SwitchSingle':
        if (state.on) {
          addEdge(`${comp.id}_in`, `${comp.id}_out`);
        }
        break;
      case 'SwitchDouble':
        if (state.on1) {
          addEdge(`${comp.id}_in`, `${comp.id}_out1`);
        }
        if (state.on2) {
          addEdge(`${comp.id}_in`, `${comp.id}_out2`);
        }
        break;
      case 'SwitchWay3':
        if (state.on) {
          addEdge(`${comp.id}_com`, `${comp.id}_L1`);
        } else {
          addEdge(`${comp.id}_com`, `${comp.id}_L2`);
        }
        break;
      case 'SwitchCross':
        if (state.on) {
          addEdge(`${comp.id}_in1`, `${comp.id}_out2`);
          addEdge(`${comp.id}_in2`, `${comp.id}_out1`);
        } else {
          addEdge(`${comp.id}_in1`, `${comp.id}_out1`);
          addEdge(`${comp.id}_in2`, `${comp.id}_out2`);
        }
        break;
      case 'JunctionBox':
        addEdge(`${comp.id}_top`, `${comp.id}_bottom`);
        addEdge(`${comp.id}_top`, `${comp.id}_left`);
        addEdge(`${comp.id}_top`, `${comp.id}_right`);
        addEdge(`${comp.id}_bottom`, `${comp.id}_left`);
        addEdge(`${comp.id}_bottom`, `${comp.id}_right`);
        addEdge(`${comp.id}_left`, `${comp.id}_right`);
        break;
      case 'TerminalBlock':
        addEdge(`${comp.id}_t1`, `${comp.id}_b1`);
        addEdge(`${comp.id}_t2`, `${comp.id}_b2`);
        addEdge(`${comp.id}_t3`, `${comp.id}_b3`);
        addEdge(`${comp.id}_t4`, `${comp.id}_b4`);
        break;
      default:
        break;
    }
  });

  // 5. Propagate potentials from power sources
  const potentials = {};
  const queue = [];

  function setPotential(rootId, type) {
    if (!potentials[rootId]) {
      potentials[rootId] = { R: false, S: false, T: false, N: false, PE: false };
    }
    if (!potentials[rootId][type]) {
      potentials[rootId][type] = true;
      return true;
    }
    return false;
  }

  components.forEach(comp => {
    if (comp.type === 'Source_1P') {
      const rL = pinToRoot[`${comp.id}_L`];
      const rN = pinToRoot[`${comp.id}_N`];
      const rPE = pinToRoot[`${comp.id}_PE`];
      
      if (rL !== undefined) { setPotential(rL, 'R'); queue.push({ root: rL, type: 'R' }); }
      if (rN !== undefined) { setPotential(rN, 'N'); queue.push({ root: rN, type: 'N' }); }
      if (rPE !== undefined) { setPotential(rPE, 'PE'); queue.push({ root: rPE, type: 'PE' }); }
    } else if (comp.type === 'Source_3P') {
      const rR = pinToRoot[`${comp.id}_R`];
      const rS = pinToRoot[`${comp.id}_S`];
      const rT = pinToRoot[`${comp.id}_T`];
      const rN = pinToRoot[`${comp.id}_N`];
      const rPE = pinToRoot[`${comp.id}_PE`];
      
      if (rR !== undefined) { setPotential(rR, 'R'); queue.push({ root: rR, type: 'R' }); }
      if (rS !== undefined) { setPotential(rS, 'S'); queue.push({ root: rS, type: 'S' }); }
      if (rT !== undefined) { setPotential(rT, 'T'); queue.push({ root: rT, type: 'T' }); }
      if (rN !== undefined) { setPotential(rN, 'N'); queue.push({ root: rN, type: 'N' }); }
      if (rPE !== undefined) { setPotential(rPE, 'PE'); queue.push({ root: rPE, type: 'PE' }); }
    }
  });

  while (queue.length > 0) {
    const { root, type } = queue.shift();
    const neighbors = adj[root];
    if (neighbors) {
      neighbors.forEach(neigh => {
        if (setPotential(neigh, type)) {
          queue.push({ root: neigh, type });
        }
      });
    }
  }

  // 5b. Build endpoint graph to calculate distance (depth) from power source for animation flow
  const epGraph = {};
  function addEpEdge(u, v) {
    if (!u || !v) return;
    if (!epGraph[u]) epGraph[u] = [];
    if (!epGraph[v]) epGraph[v] = [];
    epGraph[u].push(v);
    epGraph[v].push(u);
  }

  wires.forEach(wire => {
    const u = getEndpointId(wire.from);
    const v = getEndpointId(wire.to);
    if (wire.path && wire.path.length > 0) {
      let prev = u;
      wire.path.forEach((wp, idx) => {
        const wpKey = wp.id !== undefined ? `${wire.id}_wp_${wp.id}` : `${wire.id}_wp_${idx}`;
        addEpEdge(prev, wpKey);
        prev = wpKey;
      });
      addEpEdge(prev, v);
    } else {
      addEpEdge(u, v);
    }
  });

  components.forEach(comp => {
    const s = comp.state || {};
    switch (comp.type) {
      case 'MCB_1P':
        if (s.on && !s.tripped) addEpEdge(`${comp.id}_in`, `${comp.id}_out`);
        break;
      case 'MCB_3P':
        if (s.on) {
          addEpEdge(`${comp.id}_in_R`, `${comp.id}_out_R`);
          addEpEdge(`${comp.id}_in_S`, `${comp.id}_out_S`);
          addEpEdge(`${comp.id}_in_T`, `${comp.id}_out_T`);
        }
        break;
      case 'PanelPHB':
        // Netral & PE selalu tersambung langsung (bus bar, tidak melewati pemutus)
        addEpEdge(`${comp.id}_in_N`, `${comp.id}_out_N`);
        addEpEdge(`${comp.id}_in_PE`, `${comp.id}_out_PE`);

        if (s.mainOn && !s.mainTripped) {
          // Pengaman utama menyalurkan R, S, T ke bus internal
          if (s.group1On && !s.group1Tripped) addEpEdge(`${comp.id}_in_R`, `${comp.id}_out1_L`);
          if (s.group2On && !s.group2Tripped) addEpEdge(`${comp.id}_in_S`, `${comp.id}_out2_L`);
          if (s.group3On && !s.group3Tripped) addEpEdge(`${comp.id}_in_T`, `${comp.id}_out3_L`);
        }
        break;
      case 'Fuse':
        if (!s.blown) addEpEdge(`${comp.id}_in`, `${comp.id}_out`);
        break;
      case 'SwitchSingle':
        if (s.on) addEpEdge(`${comp.id}_in`, `${comp.id}_out`);
        break;
      case 'SwitchDouble':
        if (s.on1) addEpEdge(`${comp.id}_in`, `${comp.id}_out1`);
        if (s.on2) addEpEdge(`${comp.id}_in`, `${comp.id}_out2`);
        break;
      case 'SwitchWay3':
        if (s.on) addEpEdge(`${comp.id}_com`, `${comp.id}_L1`);
        else addEpEdge(`${comp.id}_com`, `${comp.id}_L2`);
        break;
      case 'SwitchCross':
        if (s.on) {
          addEpEdge(`${comp.id}_in1`, `${comp.id}_out2`);
          addEpEdge(`${comp.id}_in2`, `${comp.id}_out1`);
        } else {
          addEpEdge(`${comp.id}_in1`, `${comp.id}_out1`);
          addEpEdge(`${comp.id}_in2`, `${comp.id}_out2`);
        }
        break;
      case 'TerminalBlock':
        addEpEdge(`${comp.id}_t1`, `${comp.id}_b1`);
        addEpEdge(`${comp.id}_t2`, `${comp.id}_b2`);
        addEpEdge(`${comp.id}_t3`, `${comp.id}_b3`);
        addEpEdge(`${comp.id}_t4`, `${comp.id}_b4`);
        break;
      case 'JunctionBox':
        addEpEdge(`${comp.id}_top`, `${comp.id}_bottom`);
        addEpEdge(`${comp.id}_top`, `${comp.id}_left`);
        addEpEdge(`${comp.id}_top`, `${comp.id}_right`);
        addEpEdge(`${comp.id}_bottom`, `${comp.id}_left`);
        addEpEdge(`${comp.id}_bottom`, `${comp.id}_right`);
        addEpEdge(`${comp.id}_left`, `${comp.id}_right`);
        break;
      default:
        break;
    }
  });

  const nodeDepth = {};
  const epQueue = [];

  components.forEach(comp => {
    if (comp.type === 'Source_1P') {
      ['L', 'N', 'PE'].forEach(pin => {
        const pinId = `${comp.id}_${pin}`;
        nodeDepth[pinId] = 0;
        epQueue.push(pinId);
      });
    } else if (comp.type === 'Source_3P') {
      ['R', 'S', 'T', 'N', 'PE'].forEach(pin => {
        const pinId = `${comp.id}_${pin}`;
        nodeDepth[pinId] = 0;
        epQueue.push(pinId);
      });
    }
  });

  while (epQueue.length > 0) {
    const curr = epQueue.shift();
    const currDepth = nodeDepth[curr];
    const neighbors = epGraph[curr] || [];
    for (const neigh of neighbors) {
      if (nodeDepth[neigh] === undefined) {
        nodeDepth[neigh] = currDepth + 1;
        epQueue.push(neigh);
      }
    }
  }

  const wireFlowDirection = {};
  wires.forEach(wire => {
    const fromId = getEndpointId(wire.from);
    const toId = getEndpointId(wire.to);
    const fromDepth = nodeDepth[fromId] !== undefined ? nodeDepth[fromId] : 99999;
    const toDepth = nodeDepth[toId] !== undefined ? nodeDepth[toId] : 99999;

    const isNetralWire = wire.color === 'blue';

    if (isNetralWire) {
      // Netral: arus kembali ke Sumber — arah dibalik dari Fasa (Beban -> Sumber)
      wireFlowDirection[wire.id] = fromDepth >= toDepth ? 'forward' : 'reverse';
    } else {
      // Fasa (dan PE): arus menjauh dari Sumber menuju Beban — arah normal (Sumber -> Beban)
      wireFlowDirection[wire.id] = fromDepth <= toDepth ? 'forward' : 'reverse';
    }
  });

  function hasPhase(p) {
    if (p === undefined) return false;
    const pot = potentials[p];
    return pot && (pot.R || pot.S || pot.T);
  }

  function getActivePhaseName(p) {
    if (p === undefined) return null;
    const pot = potentials[p];
    if (!pot) return null;
    if (pot.R) return 'R';
    if (pot.S) return 'S';
    if (pot.T) return 'T';
    return null;
  }

  function hasNetral(p) {
    if (p === undefined) return false;
    const pot = potentials[p];
    return pot && pot.N;
  }

  function hasGround(p) {
    if (p === undefined) return false;
    const pot = potentials[p];
    return pot && pot.PE;
  }

  // 6. DETECT ERROR: Short Circuit
  let shortCircuitDetected = false;
  let shortCircuitReason = "";
  let shortCircuitType = null; // 'phase_netral' | 'phase_ground' | 'cross_phase'

  for (const rootId of Object.keys(potentials)) {
    const pot = potentials[rootId];
    const phases = (pot.R ? 1 : 0) + (pot.S ? 1 : 0) + (pot.T ? 1 : 0);
    
    // Phase touches Netral
    if ((pot.R || pot.S || pot.T) && pot.N) {
      shortCircuitDetected = true;
      shortCircuitType = 'phase_netral';
      shortCircuitReason = "Kabel Fasa langsung terhubung ke kabel Netral tanpa melalui tahanan beban (korsleting murni).";
      break;
    }
    // Phase touches Ground
    if ((pot.R || pot.S || pot.T) && pot.PE) {
      shortCircuitDetected = true;
      shortCircuitType = 'phase_ground';
      shortCircuitReason = "Kabel Fasa langsung menyentuh kabel Grounding / Arde (korsleting tanah).";
      break;
    }
    // Cross phase short
    if (phases > 1) {
      shortCircuitDetected = true;
      shortCircuitType = 'cross_phase';
      shortCircuitReason = "Dua fasa berbeda (misalnya R dan S) tersambung langsung tanpa tahanan beban (korsleting antarfasa).";
      break;
    }
  }

  // 7. Update components active status
  const activeComponents = JSON.parse(JSON.stringify(components));
  let alerts = [];

  if (shortCircuitDetected) {
    // TRIP MCB / BLOW FUSE: trip all MCBs, blow all Fuses, and reset switches
    activeComponents.forEach(comp => {
      if (comp.type === 'MCB_1P' || comp.type === 'MCB_3P') {
        comp.state.on = false;
        comp.state.tripped = true;
      } else if (comp.type === 'PanelPHB') {
        comp.state.mainOn = false;
        comp.state.mainTripped = true;
        comp.state.group1On = false; comp.state.group1Tripped = true;
        comp.state.group2On = false; comp.state.group2Tripped = true;
        comp.state.group3On = false; comp.state.group3Tripped = true;
      } else if (comp.type === 'Fuse') {
        comp.state.blown = true;
      } else if (comp.type === 'SwitchSingle' || comp.type === 'SwitchWay3' || comp.type === 'SwitchCross') {
        comp.state.on = false;
      } else if (comp.type === 'SwitchDouble') {
        comp.state.on1 = false;
        comp.state.on2 = false;
      }
      if (comp.type === 'Lamp' || comp.type === 'LampTL') {
        comp.state.on = false;
      }
    });

    // Run path-finding BFS to precisely pinpoint the illegal bridge wire and its endpoints
    const bridgeResult = findShortCircuitBridge(components, wires, shortCircuitType);

    alerts.push({
      id: 'short_circuit',
      type: 'error',
      title: 'Simulasi Ditolak — Korsleting / Hubung Singkat',
      location: bridgeResult.locationText,
      problem: shortCircuitReason,
      danger: 'Arus hubung singkat tak terbatas mengalir seketika tanpa beban pembatas. Berbahaya memicu percikan api, kebakaran isolasi kabel, dan kerusakan peralatan!',
      fix: 'Lepas atau perbaiki kabel yang menghubungkan Fasa langsung ke Netral atau Ground. Pastikan arus Fasa selalu melewati beban (seperti Lampu) sebelum kembali ke Netral.',
      text: `Di mana: ${bridgeResult.locationText}\nMasalah: ${shortCircuitReason}\nBahaya: Arus hubung singkat tak terbatas memicu panas tinggi dan bahaya kebakaran!\nPerbaikan: Lepas kabel penyebab korsleting, lewatkan arus melalui lampu.`,
      relatedIds: bridgeResult.relatedIds
    });

    const blownFuses = activeComponents.filter(c => c.type === 'Fuse' && c.state.blown);
    if (blownFuses.length > 0 && !options.predictOnly) {
      alerts.push({
        id: 'fuse_blown',
        type: 'error',
        title: 'Sekring (Fuse) Putus Akibat Korsleting',
        location: blownFuses.map(f => f.name || 'Sekring').join(', '),
        problem: 'Kawat lebur di dalam sekring putus permanen akibat lonjakan arus ekstrem hubung singkat.',
        danger: 'Sekring TIDAK DAPAT di-reset seperti MCB karena kawat leburnya telah meleleh secara fisik untuk memutus arus bahaya demi keselamatan instalasi.',
        fix: 'Perbaiki penyebab korsleting terlebih dahulu, lalu klik komponen Sekring dan pilih "Ganti Sekring Baru" pada menu konteks.',
        text: 'Kawat sekring melebur dan putus permanen. Perbaiki rangkaian dan ganti sekring baru via menu.',
        relatedIds: blownFuses.map(f => f.id)
      });
    }

    return {
      components: activeComponents,
      wires: wires,
      alerts: alerts,
      shortCircuit: true,
      pinToRoot,
      potentials,
      wireEndpointToRoot,
      nodeDepth,
      wireFlowDirection,
      activeCircuitRoots: new Set()
    };
  }

  // 8. Normal simulation evaluation (No short circuit)
  let lampCountsByPhase = { R: 0, S: 0, T: 0 };
  const activeCircuitRoots = new Set();

  function markActiveCircuitRoots(startRoot) {
    if (startRoot === undefined) return;
    const q = [startRoot];
    const visitedR = new Set([startRoot]);
    activeCircuitRoots.add(startRoot);
    while (q.length > 0) {
      const curr = q.shift();
      activeCircuitRoots.add(curr);
      const neighbors = adj[curr];
      if (neighbors) {
        neighbors.forEach(neigh => {
          if (!visitedR.has(neigh)) {
            visitedR.add(neigh);
            q.push(neigh);
          }
        });
      }
    }
  }

  activeComponents.forEach(comp => {
    const rootL = pinToRoot[`${comp.id}_L`];
    const rootN = pinToRoot[`${comp.id}_N`];
    const rootPE = pinToRoot[`${comp.id}_PE`];
    const compLabel = getComponentLabel(comp, components);
    
    if (comp.type === 'Lamp' || comp.type === 'LampTL') {
      const hasLPhase = hasPhase(rootL);
      const hasLNetral = hasNetral(rootL);
      const hasNPhase = hasPhase(rootN);
      const hasNNetral = hasNetral(rootN);

      // A lamp turns ON if one terminal has Phase and the other has Netral
      const isEnergized = (hasLPhase && hasNNetral) || (hasNPhase && hasLNetral);
      comp.state.on = isEnergized;

      if (isEnergized) {
        const activePhase = getActivePhaseName(rootL) || getActivePhaseName(rootN) || 'R';
        lampCountsByPhase[activePhase]++;
        markActiveCircuitRoots(rootL);
        markActiveCircuitRoots(rootN);
      }

      // Check for reverse polarity error (PUIL) - ELEVATED TO ERROR (BLOKIR SIMULASI)
      // Phase MUST go to Center terminal (L), Netral to Screw thread (N)
      if (hasNPhase && !hasNNetral) {
        // Specific wires connected ONLY to terminal L and N of this lamp
        const lampPolarityWires = wires.filter(w =>
          (w.from && w.from.type === 'pin' && w.from.componentId === comp.id && (w.from.pinName === 'L' || w.from.pinName === 'N')) ||
          (w.to && w.to.type === 'pin' && w.to.componentId === comp.id && (w.to.pinName === 'L' || w.to.pinName === 'N'))
        ).map(w => w.id);

        alerts.push({
          id: `polarity_${comp.id}`,
          type: 'error',
          title: 'Simulasi Ditolak — Salah Polaritas Fitting',
          location: `${compLabel} (terminal L dan terminal N)`,
          problem: `Kabel Fasa terhubung ke terminal N (ulir luar fitting), sedangkan kabel Netral terhubung ke terminal L (kontak lidah tengah).`,
          danger: `Ulir luar fitting akan bertegangan fasa terus-menerus. Berisiko fatal menyengat siswa/pengguna saat mengganti atau memasang bohlam lampu!`,
          fix: `Tukar sambungan kabel pada ${compLabel}: pasang kabel Fasa ke terminal L (tengah) dan kabel Netral ke terminal N (ulir luar).`,
          text: `Di mana: ${compLabel} (terminal L dan N)\nMasalah: Kabel Fasa terhubung ke terminal N (ulir luar fitting).\nBahaya: Ulir fitting bertegangan — bisa menyetrum saat mengganti lampu.\nPerbaikan: Tukar sambungan kabel Fasa dan Netral pada ${compLabel}.`,
          relatedIds: [comp.id, ...lampPolarityWires]
        });
      }

      // Check for 380V Overvoltage on 220V load - ERROR (BLOKIR SIMULASI)
      if (hasLPhase && hasNPhase) {
        const phaseL = getActivePhaseName(rootL);
        const phaseN = getActivePhaseName(rootN);
        if (phaseL !== phaseN) {
          comp.state.on = false; // Destroyed lamp

          const overvoltageWires = wires.filter(w =>
            (w.from && w.from.type === 'pin' && w.from.componentId === comp.id && (w.from.pinName === 'L' || w.from.pinName === 'N')) ||
            (w.to && w.to.type === 'pin' && w.to.componentId === comp.id && (w.to.pinName === 'L' || w.to.pinName === 'N'))
          ).map(w => w.id);

          alerts.push({
            id: `overvoltage_${comp.id}`,
            type: 'error',
            title: 'Kerusakan Beban (Overvoltage 380V)',
            location: `${compLabel} (terminal L dan terminal N)`,
            problem: `Tegangan 380V (Fasa ${phaseL} bertemu Fasa ${phaseN}) mengalir masuk ke ${compLabel} yang dirancang untuk tegangan 220V.`,
            danger: `Beban penerangan 220V tidak mampu menahan tegangan antarfasa 380V. Filamen/driver lampu akan meledak dan terbakar seketika!`,
            fix: `Pastikan satu terminal ${compLabel} terhubung ke kabel Netral (N 220V), bukan ke dua fasa yang berbeda.`,
            text: `Di mana: ${compLabel} (terminal L dan N)\nMasalah: Tegangan 380V (Fasa ${phaseL} - Fasa ${phaseN}) masuk ke beban 220V.\nBahaya: Lampu meledak/terbakar karena kelebihan tegangan.\nPerbaikan: Hubungkan salah satu terminal lampu ke kabel Netral (N).`,
            relatedIds: [comp.id, ...overvoltageWires]
          });
        }
      }
    }

    if (comp.type === 'Socket') {
      const hasLPhase = hasPhase(rootL);
      const hasNNetral = hasNetral(rootN);
      const hasPE = hasGround(rootPE);
      
      comp.state.on = hasLPhase && hasNNetral;

      if (comp.state.on) {
        markActiveCircuitRoots(rootL);
        markActiveCircuitRoots(rootN);
      }

      // Ground tertukar - ERROR (BLOKIR SIMULASI)
      if (hasGround(rootL) || hasGround(rootN)) {
        const swappedPin = hasGround(rootL) ? 'L' : 'N';
        const socketWires = wires.filter(w =>
          (w.from && w.from.type === 'pin' && w.from.componentId === comp.id && (w.from.pinName === 'PE' || w.from.pinName === swappedPin)) ||
          (w.to && w.to.type === 'pin' && w.to.componentId === comp.id && (w.to.pinName === 'PE' || w.to.pinName === swappedPin))
        ).map(w => w.id);

        alerts.push({
          id: `socket_polar_${comp.id}`,
          type: 'error',
          title: 'Ground Tertukar pada Stop Kontak',
          location: `${compLabel} (terminal ${swappedPin} dan terminal PE)`,
          problem: `Kabel Grounding terhubung ke terminal daya utama (${swappedPin}), atau sebaliknya kabel daya terhubung ke terminal arde.`,
          danger: `Tegangan listrik akan bocor ke casing logam peralatan elektronik yang dicolokkan ke ${compLabel}, menimbulkan bahaya sengatan listrik langsung!`,
          fix: `Pasang kabel Fasa ke terminal L, kabel Netral ke terminal N, dan kabel Grounding (kuning-hijau) khusus pada terminal arde (PE) tengah ${compLabel}.`,
          text: `Di mana: ${compLabel} (terminal ${swappedPin} dan PE)\nMasalah: Kabel Grounding terhubung ke terminal daya utama.\nBahaya: Tegangan bocor ke casing peralatan dan menyengat pengguna.\nPerbaikan: Pasang kabel Grounding hanya pada terminal arde tengah (PE).`,
          relatedIds: [comp.id, ...socketWires]
        });
      }

      // Warning if ground is missing (WARNING - SIMULASI TETAP JALAN)
      if (comp.state.on && !hasPE) {
        alerts.push({
          id: `grounding_${comp.id}`,
          type: 'warning',
          title: 'Arde Tidak Terhubung',
          location: compLabel,
          problem: `${compLabel} aktif menyuplai daya tanpa pengaman pentanahan (Ground/PE).`,
          danger: `Jika terjadi kebocoran fasa pada peralatan berbody logam, arus bocor tidak dapat dialirkan ke tanah dan dapat menyetrum.`,
          fix: `Hubungkan kabel Grounding (kuning-hijau) dari sumber listrik ke terminal arde ${compLabel}.`,
          text: `Di mana: ${compLabel}\nMasalah: Stop kontak aktif tanpa pentanahan (Ground/Arde).\nBahaya: Berbahaya untuk alat berbody logam jika terjadi kebocoran fasa.\nPerbaikan: Hubungkan kabel arde (PE) ke terminal tengah stop kontak.`,
          relatedIds: [comp.id]
        });
      }
    }
  });

  // 9. Check Load Balancing (Only for 3-Phase Sources - WARNING)
  const has3P = components.some(c => c.type === 'Source_3P');
  if (has3P) {
    const { R, S, T } = lampCountsByPhase;
    const activeLamps = R + S + T;
    if (activeLamps > 1) {
      const loads = [R, S, T];
      const maxLoad = Math.max(...loads);
      const minLoad = Math.min(...loads);
      
      if (maxLoad - minLoad >= 2) {
        alerts.push({
          id: 'balancing_warning',
          type: 'warning',
          title: 'Penyeimbangan Beban Kurang Ideal',
          location: 'Panel Distribusi 3-Fasa',
          problem: `Distribusi beban fasa tidak seimbang (R: ${R} lampu, S: ${S} lampu, T: ${T} lampu).`,
          danger: `Ketidakseimbangan beban memicu arus balik besar pada kawat Netral dan pemanasan berlebih pada transformator sumber.`,
          fix: `Bagi beban lampu secara merata ke dalam 3 grup fasa (R, S, dan T) agar selisih beban antar fasa seimbang.`,
          text: `Di mana: Panel Distribusi 3-Fasa\nMasalah: Beban tidak seimbang (R: ${R}, S: ${S}, T: ${T}).\nBahaya: Memicu arus balik kawat netral dan rugi daya trafo.\nPerbaikan: Seimbangkan jumlah lampu di setiap fasa R, S, dan T.`,
          relatedIds: []
        });
      }
    }
  }

  // 10. Check floating/open wires (WARNING - SIMULASI TETAP JALAN)
  wires.forEach(wire => {
    const fromSnapped = (wire.from.type === 'pin' && uf.find(`${wire.from.componentId}_${wire.from.pinName}`)) || 
                         (wire.from.type === 'wire');
    const toSnapped = (wire.to.type === 'pin' && uf.find(`${wire.to.componentId}_${wire.to.pinName}`)) || 
                       (wire.to.type === 'wire');
                       
    if (!fromSnapped || !toSnapped) {
      const wireLabel = getWireLabel(wire, components);
      alerts.push({
        id: `floating_${wire.id}`,
        type: 'warning',
        title: 'Kabel Menggantung (Open Circuit)',
        location: wireLabel,
        problem: `Kabel belum tersambung sempurna pada salah satu ujungnya.`,
        danger: `Ujung konduktor terbuka berpotensi tersentuh tangan atau memicu korsleting tidak terduga.`,
        fix: `Sambungkan ujung kabel ke pin komponen atau hapus kabel jika tidak diperlukan.`,
        text: `Di mana: ${wireLabel}\nMasalah: Ujung kabel belum terhubung (rangkaian terbuka).\nBahaya: Potensi korsleting atau tersentuh konduktor terbuka.\nPerbaikan: Sambungkan kabel ke pin atau hapus kabel.`,
        relatedIds: [wire.id]
      });
    }
  });

  return {
    components: activeComponents,
    wires: wires,
    alerts: alerts,
    shortCircuit: false,
    pinToRoot,
    potentials,
    wireEndpointToRoot,
    nodeDepth,
    wireFlowDirection,
    activeCircuitRoots
  };
}

/**
 * Evaluates all possible switch combinations to proactively detect ANY fatal error
 * even if switches are currently in the OFF position.
 * Returns unique array of error alerts.
 */
export function detectAllErrors(canvasState) {
  if (!canvasState || !canvasState.components || canvasState.components.length === 0) {
    return [];
  }
  const { components, wires } = canvasState;
  if (!wires || wires.length === 0) {
    return [];
  }

  // 1. Backup original states of all components
  const backup = components.map(c => ({
    id: c.id,
    state: JSON.parse(JSON.stringify(c.state || {}))
  }));

  // 2. Identify controllable switches
  const switchItems = [];
  components.forEach(comp => {
    if (comp.type === 'SwitchSingle' || comp.type === 'SwitchWay3' || comp.type === 'SwitchCross') {
      switchItems.push({ comp, key: 'on' });
    } else if (comp.type === 'SwitchDouble') {
      switchItems.push({ comp, key: 'on1' });
      switchItems.push({ comp, key: 'on2' });
    }
  });

  // 3. Generate test combinations (capped at max 64 combinations for optimal performance)
  const totalCombinations = Math.pow(2, switchItems.length);
  const combinationsToTest = [];

  if (switchItems.length === 0) {
    combinationsToTest.push([]);
  } else if (switchItems.length <= 6) {
    for (let mask = 0; mask < totalCombinations; mask++) {
      const combo = [];
      for (let i = 0; i < switchItems.length; i++) {
        combo.push(Boolean(mask & (1 << i)));
      }
      combinationsToTest.push(combo);
    }
  } else {
    // If > 6 switches, test:
    // - All OFF
    combinationsToTest.push(new Array(switchItems.length).fill(false));
    // - All ON
    combinationsToTest.push(new Array(switchItems.length).fill(true));
    // - Single ON each
    for (let i = 0; i < switchItems.length; i++) {
      const combo = new Array(switchItems.length).fill(false);
      combo[i] = true;
      combinationsToTest.push(combo);
    }
    // - Random combinations to reach 64
    while (combinationsToTest.length < 64) {
      const combo = switchItems.map(() => Math.random() > 0.5);
      combinationsToTest.push(combo);
    }
  }

  // 4. Test each combination and collect unique error alerts
  const errorMap = new Map();

  for (const combo of combinationsToTest) {
    // Turn ON all MCBs so power flows
    components.forEach(c => {
      if (c.type === 'MCB_1P' || c.type === 'MCB_3P') {
        c.state = c.state || {};
        c.state.on = true;
        c.state.tripped = false;
      }
    });

    // Apply current switch combination
    switchItems.forEach((item, idx) => {
      item.comp.state = item.comp.state || {};
      item.comp.state[item.key] = combo[idx];
    });

    // Evaluate circuit with this combination
    const res = evaluateCircuit(canvasState, { predictOnly: true });
    const errors = res.alerts.filter(a => a.type === 'error');
    for (const err of errors) {
      if (!errorMap.has(err.id)) {
        errorMap.set(err.id, err);
      }
    }
  }

  // 5. Restore components to original state
  backup.forEach(b => {
    const c = components.find(comp => comp.id === b.id);
    if (c) c.state = b.state;
  });

  return Array.from(errorMap.values());
}

/**
 * Mendiagnosis rangkaian pada Mode Merakit Bebas (Free Mode).
 * Memeriksa seluruh kemungkinan posisi saklar, integritas pengkabelan,
 * kesalahan polaritas, saklar di netral, dan beban yang tidak pernah menyala.
 * Mengembalikan objek terstruktur: { errors: [...], warnings: [...], notes: [...] }
 *
 * @param {Object} canvasState - State kanvas ({ components, wires })
 * @returns {{ errors: Array, warnings: Array, notes: Array }}
 */
export function diagnoseCircuit(canvasState) {
  if (!canvasState || !canvasState.components || canvasState.components.length === 0) {
    return {
      errors: [],
      warnings: [],
      notes: ['Kanvas masih kosong. Tambahkan komponen terlebih dahulu.']
    };
  }

  const { components, wires = [] } = canvasState;

  // Jika hanya ada 1 komponen sumber dan belum ada kabel sama sekali
  if (components.length === 1 && (components[0].type === 'Source_1P' || components[0].type === 'Source_3P') && wires.length === 0) {
    return {
      errors: [],
      warnings: [],
      notes: ['Kanvas masih kosong. Tambahkan komponen terlebih dahulu.']
    };
  }

  // Jika ada komponen tetapi belum ada kabel sama sekali
  if (wires.length === 0) {
    return {
      errors: [{
        id: 'no_wires',
        type: 'error',
        title: 'Belum Ada Kabel yang Terpasang',
        location: 'Kanvas Rangkaian',
        where: 'Kanvas Rangkaian',
        problem: 'Tidak ada kabel yang menghubungkan komponen di kanvas.',
        fix: 'Sambungkan terminal sumber ke MCB, saklar, dan beban.',
        text: 'Di mana: Kanvas Rangkaian\nMasalah: Belum ada kabel penghubung\nPerbaikan: Sambungkan terminal sumber ke MCB, saklar, dan beban.'
      }],
      warnings: [],
      notes: []
    };
  }

  // 1. Cadangkan state komponen asli
  const backup = components.map(c => ({
    id: c.id,
    state: JSON.parse(JSON.stringify(c.state || {}))
  }));

  // 2. Kumpulkan saklar yang dapat dialihkan
  const switchItems = [];
  components.forEach(comp => {
    comp.state = comp.state || {};
    if (comp.type === 'SwitchSingle' || comp.type === 'SwitchWay3' || comp.type === 'SwitchCross') {
      switchItems.push({ comp, key: 'on' });
    } else if (comp.type === 'SwitchDouble') {
      switchItems.push({ comp, key: 'on1' });
      switchItems.push({ comp, key: 'on2' });
    }
  });

  // 3. Bangun kombinasi saklar
  const totalCombinations = Math.pow(2, switchItems.length);
  const combinationsToTest = [];
  if (switchItems.length === 0) {
    combinationsToTest.push([]);
  } else if (switchItems.length <= 6) {
    for (let mask = 0; mask < totalCombinations; mask++) {
      const combo = [];
      for (let i = 0; i < switchItems.length; i++) {
        combo.push(Boolean(mask & (1 << i)));
      }
      combinationsToTest.push(combo);
    }
  } else {
    combinationsToTest.push(new Array(switchItems.length).fill(false));
    combinationsToTest.push(new Array(switchItems.length).fill(true));
    for (let i = 0; i < switchItems.length; i++) {
      const combo = new Array(switchItems.length).fill(false);
      combo[i] = true;
      combinationsToTest.push(combo);
    }
    while (combinationsToTest.length < 64) {
      combinationsToTest.push(switchItems.map(() => Math.random() > 0.5));
    }
  }

  const errorMap = new Map();
  const warningMap = new Map();
  const loadEverOn = new Map();
  const loadPhaseSeen = new Map();
  const loadNetralSeen = new Map();
  const switchesOnNeutral = new Set();

  components.forEach(c => {
    if (c.type === 'Lamp' || c.type === 'LampTL' || c.type === 'Socket') {
      loadEverOn.set(c.id, false);
      loadPhaseSeen.set(c.id, false);
      loadNetralSeen.set(c.id, false);
    }
  });

  // 4. Uji semua kombinasi saklar
  for (const combo of combinationsToTest) {
    components.forEach(c => {
      c.state = c.state || {};
      if (c.type === 'MCB_1P' || c.type === 'MCB_3P') {
        c.state.on = true;
        c.state.tripped = false;
      }
      if (c.type === 'Fuse') {
        c.state.blown = false;
      }
    });

    switchItems.forEach((item, idx) => {
      item.comp.state = item.comp.state || {};
      item.comp.state[item.key] = combo[idx];
    });

    const evalRes = evaluateCircuit(canvasState, { predictOnly: true });

    evalRes.alerts.filter(a => a.type === 'error').forEach(err => {
      if (!errorMap.has(err.id)) errorMap.set(err.id, err);
    });

    evalRes.alerts.filter(a => a.type === 'warning').forEach(warn => {
      if (!warningMap.has(warn.id)) warningMap.set(warn.id, warn);
    });

    evalRes.components.forEach(c => {
      if (loadEverOn.has(c.id)) {
        if (c.state && c.state.on === true) {
          loadEverOn.set(c.id, true);
        }
        if (evalRes.pinToRoot && evalRes.potentials) {
          const rootL = evalRes.pinToRoot[`${c.id}_L`];
          const rootN = evalRes.pinToRoot[`${c.id}_N`];
          const potL = rootL !== undefined ? evalRes.potentials[rootL] : null;
          const potN = rootN !== undefined ? evalRes.potentials[rootN] : null;
          if ((potL && (potL.R || potL.S || potL.T)) || (potN && (potN.R || potN.S || potN.T))) {
            loadPhaseSeen.set(c.id, true);
          }
          if ((potL && potL.N) || (potN && potN.N)) {
            loadNetralSeen.set(c.id, true);
          }
        }
      }
    });

    if (evalRes.pinToRoot && evalRes.potentials) {
      components.forEach(c => {
        if (['SwitchSingle', 'SwitchDouble', 'SwitchWay3', 'SwitchCross'].includes(c.type)) {
          const pins = c.type === 'SwitchDouble'
            ? ['in', 'out1', 'out2']
            : (c.type === 'SwitchWay3'
              ? ['com', 'L1', 'L2']
              : (c.type === 'SwitchCross'
                ? ['in1', 'in2', 'out1', 'out2']
                : ['in', 'out']));

          if (pins.some(p => {
            const r = evalRes.pinToRoot[`${c.id}_${p}`];
            return r !== undefined && evalRes.potentials[r] && evalRes.potentials[r].N;
          })) {
            switchesOnNeutral.add(c.id);
          }
        }
      });
    }
  }

  // 5. Kembalikan state asli komponen
  backup.forEach(b => {
    const c = components.find(comp => comp.id === b.id);
    if (c) c.state = b.state;
  });

  // 6. Pengecekan sambungan terminal sumber
  components.forEach(src => {
    const compLabel = getComponentLabel(src, components);
    if (src.type === 'Source_1P') {
      const hasWireL = wires.some(w => (w.from && w.from.componentId === src.id && w.from.pinName === 'L') || (w.to && w.to.componentId === src.id && w.to.pinName === 'L'));
      const hasWireN = wires.some(w => (w.from && w.from.componentId === src.id && w.from.pinName === 'N') || (w.to && w.to.componentId === src.id && w.to.pinName === 'N'));
      if (!hasWireL || !hasWireN) {
        const missing = (!hasWireL && !hasWireN) ? 'L dan N' : (!hasWireL ? 'L' : 'N');
        warningMap.set(`unused_source_${src.id}`, {
          id: `unused_source_${src.id}`,
          type: 'warning',
          title: 'Terminal Sumber Belum Terhubung',
          location: compLabel,
          where: compLabel,
          problem: `Terminal ${missing} sumber belum terhubung ke rangkaian.`,
          fix: 'Hubungkan terminal sumber ke pengaman (MCB) dan beban.',
          text: `Di mana: ${compLabel}\nMasalah: Terminal ${missing} belum terhubung\nPerbaikan: Hubungkan terminal sumber ke rangkaian.`
        });
      }
    } else if (src.type === 'Source_3P') {
      const hasWireR = wires.some(w => (w.from && w.from.componentId === src.id && w.from.pinName === 'R') || (w.to && w.to.componentId === src.id && w.to.pinName === 'R'));
      const hasWireS = wires.some(w => (w.from && w.from.componentId === src.id && w.from.pinName === 'S') || (w.to && w.to.componentId === src.id && w.to.pinName === 'S'));
      const hasWireT = wires.some(w => (w.from && w.from.componentId === src.id && w.from.pinName === 'T') || (w.to && w.to.componentId === src.id && w.to.pinName === 'T'));
      if (!hasWireR && !hasWireS && !hasWireT) {
        warningMap.set(`unused_source_${src.id}`, {
          id: `unused_source_${src.id}`,
          type: 'warning',
          title: 'Terminal Fasa Sumber 3-Fasa Belum Terhubung',
          location: compLabel,
          where: compLabel,
          problem: 'Tidak ada fasa (R, S, T) sumber yang terhubung ke rangkaian.',
          fix: 'Hubungkan minimal satu terminal fasa sumber ke pengaman/MCB.',
          text: `Di mana: ${compLabel}\nMasalah: Terminal fasa belum terhubung\nPerbaikan: Hubungkan terminal fasa sumber ke rangkaian.`
        });
      }
    }
  });

  // 7. Pengecekan saklar pada jalur netral
  switchesOnNeutral.forEach(swId => {
    const swComp = components.find(c => c.id === swId);
    const swLabel = getComponentLabel(swComp, components);
    errorMap.set(`switch_on_neutral_${swId}`, {
      id: `switch_on_neutral_${swId}`,
      type: 'error',
      title: 'Saklar Terpasang pada Jalur Netral',
      location: swLabel,
      where: swLabel,
      problem: 'Saklar memutus kabel Netral, bukan kabel Fasa.',
      danger: 'Beban tetap bertegangan Fasa meskipun saklar dalam keadaan OFF (risiko sengatan listrik saat mengganti bohlam atau perawatan). Sesuai PUIL, saklar wajib memutus Fasa!',
      fix: 'Pindahkan saklar ke jalur kabel Fasa, dan hubungkan Netral langsung ke beban.',
      text: `Di mana: ${swLabel}\nMasalah: Saklar memutus jalur Netral\nBahaya: Beban tetap bertegangan fasa saat saklar OFF!\nPerbaikan: Pasang saklar pada kabel Fasa sesuai standar PUIL.`
    });
  });

  // 8. Pengecekan beban yang tidak pernah menyala (hanya jika tidak ada korsleting)
  const hasShortCircuit = errorMap.has('short_circuit');
  if (!hasShortCircuit) {
    components.forEach(comp => {
      if (['Lamp', 'LampTL', 'Socket'].includes(comp.type)) {
        if (!loadEverOn.get(comp.id)) {
          const compLabel = getComponentLabel(comp, components);
          const hasWireL = wires.some(w => (w.from && w.from.componentId === comp.id && w.from.pinName === 'L') || (w.to && w.to.componentId === comp.id && w.to.pinName === 'L'));
          const hasWireN = wires.some(w => (w.from && w.from.componentId === comp.id && w.from.pinName === 'N') || (w.to && w.to.componentId === comp.id && w.to.pinName === 'N'));

          let diagMsg = '';
          if (!hasWireL && !hasWireN) {
            diagMsg = 'Terminal L dan N belum terhubung ke kabel mana pun.';
          } else if (!hasWireL) {
            diagMsg = 'Terminal L belum terhubung ke kabel mana pun.';
          } else if (!hasWireN) {
            diagMsg = 'Terminal N belum terhubung ke kabel mana pun.';
          } else {
            const phaseSeen = loadPhaseSeen.get(comp.id) === true;
            const netralSeen = loadNetralSeen.get(comp.id) === true;
            if (!phaseSeen && !netralSeen) {
              diagMsg = 'Terminal tidak mendapat Fasa dari sumber dan tidak terhubung ke Netral.';
            } else if (!phaseSeen) {
              diagMsg = 'Terminal tidak mendapat Fasa dari sumber.';
            } else if (!netralSeen) {
              diagMsg = 'Terminal tidak terhubung ke Netral.';
            } else if (switchesOnNeutral.size > 0) {
              diagMsg = 'Saklar sebaiknya dipasang pada kabel Fasa, bukan Netral (PUIL).';
            } else {
              diagMsg = 'Beban tidak pernah menerima beda potensial yang cukup.';
            }
          }

          errorMap.set(`load_never_on_${comp.id}`, {
            id: `load_never_on_${comp.id}`,
            type: 'error',
            title: 'Beban Tidak Pernah Menyala',
            location: compLabel,
            where: compLabel,
            problem: diagMsg,
            fix: 'Periksa sambungan kabel Fasa dan Netral menuju beban.',
            text: `Di mana: ${compLabel}\nMasalah: ${diagMsg}\nPerbaikan: Periksa sambungan kabel fasa dan netral beban.`
          });
        }
      }
    });
  }

  return {
    errors: Array.from(errorMap.values()),
    warnings: Array.from(warningMap.values()),
    notes: []
  };
}
