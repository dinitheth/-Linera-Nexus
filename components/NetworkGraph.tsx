import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { ChainNode } from '../types';

interface NetworkGraphProps {
  chains: ChainNode[];
  activeTransaction?: { from: string; to: string } | null;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ chains, activeTransaction }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const nodesRef = useRef<any[]>([]); 
  
  // State to track dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Function to setup/update graph background (Grid & ViewBox)
  const updateGrid = (width: number, height: number) => {
    if (!svgRef.current || width === 0 || height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", [0, 0, width, height]);
    
    // Update grid lines
    const gridSize = 40;
    const gridGroup = svg.select(".grid-layer");
    
    gridGroup.selectAll("*").remove();
    
    // Vertical lines
    gridGroup.selectAll("line.vertical")
      .data(d3.range(0, width + gridSize, gridSize))
      .enter().append("line")
      .attr("x1", d => Math.floor(d) + 0.5)
      .attr("y1", 0)
      .attr("x2", d => Math.floor(d) + 0.5)
      .attr("y2", height)
      .attr("stroke", "#374151") // Gray 700 - Visible grid
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1)
      .style("shape-rendering", "crispEdges");

    // Horizontal lines
    gridGroup.selectAll("line.horizontal")
      .data(d3.range(0, height + gridSize, gridSize))
      .enter().append("line")
      .attr("x1", 0)
      .attr("y1", d => Math.floor(d) + 0.5)
      .attr("x2", width)
      .attr("y2", d => Math.floor(d) + 0.5)
      .attr("stroke", "#374151") // Gray 700
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1)
      .style("shape-rendering", "crispEdges");
  };

  // 1. Initialization: Static Layers
  useEffect(() => {
    if (!svgRef.current || initializedRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const defs = svg.append("defs");
    
    // Adjusted glow filters for high contrast
    const blueGlow = defs.append("filter").attr("id", "glow-blue");
    blueGlow.append("feGaussianBlur").attr("stdDeviation", "2").attr("result", "coloredBlur"); // Tighter blur
    const blueMerge = blueGlow.append("feMerge");
    blueMerge.append("feMergeNode").attr("in", "coloredBlur");
    blueMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const amberGlow = defs.append("filter").attr("id", "glow-amber");
    amberGlow.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const amberMerge = amberGlow.append("feMerge");
    amberMerge.append("feMergeNode").attr("in", "coloredBlur");
    amberMerge.append("feMergeNode").attr("in", "SourceGraphic");

    svg.append("g").attr("class", "grid-layer");
    svg.append("g").attr("class", "link-layer");
    svg.append("g").attr("class", "node-layer");
    svg.append("g").attr("class", "particle-layer");
    svg.append("g").attr("class", "legend-layer");

    // --- Legend Group ---
    const legend = svg.select(".legend-layer")
      .attr("transform", "translate(12, 12)"); // Compact positioning

    legend.append("rect")
      .attr("width", 115) // Reduced width
      .attr("height", 85) // Reduced height
      .attr("rx", 4)
      .attr("fill", "#111827")
      .attr("fill-opacity", 0.85) // More transparent
      .attr("stroke", "#374151")
      .attr("stroke-width", 1)
      .style("shape-rendering", "crispEdges");

    const legendItems = [
      { color: "#60A5FA", label: "User Chain" },
      { color: "#A78BFA", label: "Agents / Apps" },
      { color: "#FBBF24", label: "Processing" },
      { color: "#34D399", label: "Success" }
    ];

    legendItems.forEach((item, i) => {
      const g = legend.append("g")
        .attr("transform", `translate(12, ${18 + i * 18})`); // Tighter vertical spacing
      
      g.append("circle")
        .attr("r", 3) // Smaller indicators
        .attr("fill", item.color)
        .style("shape-rendering", "geometricPrecision");
      
      g.append("text")
        .text(item.label)
        .attr("x", 10)
        .attr("y", 3.5)
        .attr("fill", "#D1D5DB")
        .attr("font-size", "10px") // Smaller text
        .attr("font-family", "Inter, sans-serif")
        .attr("font-weight", "500")
        .style("text-rendering", "geometricPrecision");
    });

    initializedRef.current = true;
  }, []);

  // Handle Resize
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
       const width = Math.floor(containerRef.current?.clientWidth || 0);
       const height = Math.floor(containerRef.current?.clientHeight || 0);
       if (width > 0 && height > 0) {
           setDimensions({ width, height });
           updateGrid(width, height);
       }
    };

    measure();
    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(measure));
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 2. Data Updates: Nodes & Links
  useEffect(() => {
    if (!svgRef.current || !initializedRef.current || dimensions.width === 0) return;
    
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / (width < 600 ? 2.4 : 2.8);

    const nodesData = chains.map((chain) => {
      if (chain.type === 'user') {
        return { ...chain, x: centerX, y: centerY };
      }
      
      let x = centerX;
      let y = centerY;
      
      const isMobile = width < 600;
      const yOffset = isMobile ? radius * 0.8 : radius * 0.6;
      
      if (chain.label.includes('Alice')) { x = centerX - radius; y = centerY - yOffset; }
      else if (chain.label.includes('Bob')) { x = centerX + radius; y = centerY - yOffset; }
      else if (chain.label.includes('NFT')) { x = centerX - radius; y = centerY + yOffset; }
      else if (chain.label.includes('DAO')) { x = centerX + radius; y = centerY + yOffset; }
      else {
          const angle = (parseInt(chain.id, 36) % 360) * (Math.PI / 180);
          x = centerX + radius * Math.cos(angle);
          y = centerY + radius * Math.sin(angle);
      }
      return { ...chain, x, y };
    });

    nodesRef.current = nodesData;

    const getNodeStyle = (d: any) => {
      // Activity overrides with radius scaling
      if (d.activityStatus === 'processing') return { 
          stroke: '#FBBF24', width: 4, fill: '#451a03', iconColor: '#FBBF24', filter: 'url(#glow-amber)', r: 38 
      };
      if (d.activityStatus === 'success') return { 
          stroke: '#34D399', width: 4, fill: '#064e3b', iconColor: '#34D399', filter: 'url(#glow-blue)', r: 40 
      };
      if (d.activityStatus === 'error') return { 
          stroke: '#F87171', width: 3, fill: '#450a0a', iconColor: '#F87171', filter: '', r: 36 
      };
      
      // Default styles based on type
      if (d.type === 'user') return { 
          stroke: '#60A5FA', width: 2, fill: '#172554', iconColor: '#fff', filter: 'url(#glow-blue)', r: 36 
      };
      if (d.label.includes('NFT') || d.label.includes('DAO')) return { 
          stroke: '#A78BFA', width: 2, fill: '#2e1065', iconColor: '#E9D5FF', filter: '', r: 36 
      };
      return { 
          stroke: '#9CA3AF', width: 2, fill: '#1F2937', iconColor: '#D1D5DB', filter: '', r: 36 
      };
    };

    const getChainId = (label: string) => {
        if (label.includes('User')) return '#842';
        if (label.includes('Alice')) return '#112';
        if (label.includes('Bob')) return '#430';
        if (label.includes('NFT')) return '#900';
        if (label.includes('DAO')) return '#120';
        return '#000';
    }

    const linksData = nodesData
      .filter(n => n.type !== 'user')
      .map(n => ({ source: nodesData.find(x => x.type === 'user')!, target: n }));

    const linkLayer = svg.select(".link-layer");
    
    const linkSelection = linkLayer.selectAll("line")
      .data(linksData, (d: any) => d.target.id);

    const linksEnter = linkSelection.enter().append("line")
      .attr("stroke", "#6B7280") // Gray 500
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0)
      .attr("x1", d => d.source.x!)
      .attr("y1", d => d.source.y!)
      .attr("x2", d => d.target.x!)
      .attr("y2", d => d.target.y!)
      .style("shape-rendering", "geometricPrecision");

    linksEnter.transition().duration(800).attr("opacity", 0.5);

    linkSelection.merge(linksEnter as any)
      .transition().duration(500)
      .attr("x1", d => d.source.x!)
      .attr("y1", d => d.source.y!)
      .attr("x2", d => d.target.x!)
      .attr("y2", d => d.target.y!);

    linkSelection.exit().remove();

    // Animate links
    linkLayer.selectAll("line").transition("dash")
        .duration(3000)
        .ease(d3.easeLinear)
        .attrTween("stroke-dashoffset", () => d3.interpolateString("10", "0"))
        .on("end", function repeat() {
            d3.select(this).transition("dash")
                .duration(3000)
                .ease(d3.easeLinear)
                .attrTween("stroke-dashoffset", () => d3.interpolateString("10", "0"))
                .on("end", repeat);
        });

    const nodeLayer = svg.select(".node-layer");
    const nodeSelection = nodeLayer.selectAll<SVGGElement, any>("g.node")
        .data(nodesData, d => d.id);

    const nodesEnter = nodeSelection.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("opacity", 0)
        .attr("cursor", "pointer");

    // NODE CIRCLE
    nodesEnter.append("circle")
        .attr("r", 0) // Start from 0 for enter animation
        .attr("fill", d => getNodeStyle(d).fill)
        .style("shape-rendering", "geometricPrecision");

    // NODE ICON
    nodesEnter.append("path")
        .attr("transform", "translate(-12, -12)")
        .attr("pointer-events", "none")
        .style("shape-rendering", "geometricPrecision");

    // LABELS
    nodesEnter.append("text").attr("class", "label")
        .attr("dy", 55)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("font-weight", "600")
        .attr("font-family", "Inter, sans-serif")
        .style("text-shadow", "0px 2px 4px rgba(0,0,0,0.9)")
        .style("text-rendering", "geometricPrecision")
        .attr("opacity", 0);

    nodesEnter.append("text").attr("class", "sublabel")
        .attr("dy", 70)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-family", "Inter, sans-serif")
        .style("text-rendering", "geometricPrecision")
        .attr("opacity", 0);

    // Enter Transition
    nodesEnter.transition().duration(600).ease(d3.easeBackOut)
        .attr("opacity", 1);
        
    nodesEnter.select("circle").transition().duration(600).ease(d3.easeBackOut)
        .attr("r", d => getNodeStyle(d).r);

    nodesEnter.selectAll("text").transition().duration(600).delay(200)
        .attr("opacity", 1);

    const nodesUpdate = nodesEnter.merge(nodeSelection);

    nodesUpdate.transition().duration(500)
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodesUpdate.select("text.label").text(d => d.label).attr("fill", "#F9FAFB");
    nodesUpdate.select("text.sublabel").text(d => getChainId(d.label)).attr("fill", "#9CA3AF");
    nodesUpdate.select("path").attr("d", d => {
        if (d.type === 'user') return "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";
        if (d.label.includes('NFT') || d.label.includes('DAO')) return "M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z";
        return "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z";
    });

    // Smooth Transition for State Changes
    nodesUpdate.select("circle")
        .transition().duration(600)
        .ease(d3.easeBackOut.overshoot(1.7)) // Smooth pop animation
        .attr("r", d => getNodeStyle(d).r)
        .attr("fill", d => getNodeStyle(d).fill)
        .attr("stroke", d => getNodeStyle(d).stroke)
        .attr("stroke-width", d => getNodeStyle(d).width)
        .style("filter", d => getNodeStyle(d).filter);

    nodesUpdate.select("path")
        .transition().duration(600)
        .attr("fill", d => getNodeStyle(d).iconColor);

    // Hover Effects
    nodesUpdate
        .on("mouseenter", (event, d) => {
            const tooltip = d3.select(tooltipRef.current);
            tooltip
                .style("opacity", 1)
                .html(`
                    <div class="font-bold text-gray-100 mb-0.5">${d.label}</div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="w-1.5 h-1.5 rounded-full ${d.type === 'user' ? 'bg-blue-500' : d.type === 'agent' ? 'bg-purple-500' : 'bg-emerald-500'}"></span>
                        <span class="text-[10px] text-gray-400 uppercase tracking-wider">${d.type}</span>
                    </div>
                    <div class="text-xs text-gray-200 font-mono border-t border-gray-700 pt-1 mt-1">
                        ${d.balance.toLocaleString()} <span class="text-linera-accent text-[10px]">TLIN</span>
                    </div>
                `);

            const linkLayer = svg.select(".link-layer");
            linkLayer.selectAll("line")
                .transition("highlight")
                .duration(200)
                .attr("stroke", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? "#60A5FA" : "#374151")
                .attr("stroke-opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1)
                .attr("stroke-width", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 1);
        })
        .on("mousemove", (event) => {
            const [x, y] = d3.pointer(event, containerRef.current);
            d3.select(tooltipRef.current)
                .style("left", `${x + 15}px`)
                .style("top", `${y + 15}px`);
        })
        .on("mouseleave", () => {
             d3.select(tooltipRef.current).style("opacity", 0);
             
             const linkLayer = svg.select(".link-layer");
             linkLayer.selectAll("line")
                .transition("highlight")
                .duration(200)
                .attr("stroke", "#6B7280") 
                .attr("stroke-opacity", 0.5) 
                .attr("stroke-width", 1.5); 
        });

     nodesUpdate.each(function(d) {
        const circle = d3.select(this).select("circle");
        if (d.activityStatus === 'processing') {
            if (!circle.classed("pulsing")) {
                circle.classed("pulsing", true);
                (function repeat() {
                    circle.transition("pulse")
                        .duration(600)
                        .attr("stroke-opacity", 0.5)
                        .attr("stroke-width", 8) // Pulsing width
                        .transition("pulse")
                        .duration(600)
                        .attr("stroke-opacity", 1)
                        .attr("stroke-width", 4) // Base width
                        .on("end", function() {
                            if (circle.classed("pulsing")) repeat();
                        });
                })();
            }
        } else {
            circle.classed("pulsing", false);
            circle.interrupt("pulse");
            circle.attr("stroke-opacity", 1);
        }
    });

    nodeSelection.exit().remove();

  }, [chains, dimensions]); 

  // 3. Transaction Particle Animation
  useEffect(() => {
    if (!activeTransaction || !svgRef.current) return;
    
    const nodes = nodesRef.current;
    const sourceNode = nodes.find(n => n.id === activeTransaction.from);
    const targetNode = nodes.find(n => n.id === activeTransaction.to);

    if (sourceNode && targetNode) {
        const svg = d3.select(svgRef.current);
        const particleGroup = svg.select(".particle-layer");

        const particle = particleGroup.append("circle")
          .attr("r", 5) // Slightly larger particle
          .attr("fill", "#fff")
          .attr("filter", "url(#glow-blue)")
          .attr("cx", sourceNode.x)
          .attr("cy", sourceNode.y);

        particle.transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("cx", targetNode.x)
          .attr("cy", targetNode.y)
          .remove();
    }
  }, [activeTransaction]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative bg-[#0B0F19] overflow-hidden rounded-xl border border-linera-700 shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,78,216,0.06),transparent_80%)] pointer-events-none"></div>
      <svg ref={svgRef} style={{width: '100%', height: '100%'}} />
      <div ref={tooltipRef} className="absolute pointer-events-none bg-[#111827]/95 border border-linera-700 p-3 rounded-lg shadow-2xl z-50 opacity-0 transition-opacity duration-200 min-w-[140px] backdrop-blur-sm" style={{willChange: "transform, opacity"}} />
    </div>
  );
};

export default NetworkGraph;