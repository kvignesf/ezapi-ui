import React, { useRef, useState,useEffect,useImperativeHandle } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import * as d3 from 'd3';
import axios from 'axios';
import d3sankey from './../../sankey';
import Title from './../Title';
import { Constants } from '../../Constants';

const PARSER_URL = 'http://104.197.42.14:5000/apiops_parser';
const VISULIZER_URL = 'http://104.197.42.14:5000/visualizer'

const apiops_types = ["Business Function", "Elements", "Resource", "Endpoint", "Operation", "Status"]

const colorPalette = [
  '#ffadad',
  '#ffd6a5',
  '#fdffb6',
  '#caffbf',
  '#9bf6ff',
  '#a0c4ff',
  '#bdb2ff',
  '#ffc6ff'
];

const styles = {
  'tooltip': {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'position': 'absolute',
    'textAlign': 'center',
    'width': '200px',
    'height': '28px',
    'padding': '2px',
    'font': '12px sans-serif',
    'background': 'rgb(222, 224, 227)',
    'border': '0px',
    'borderRadius': '8px',
    'pointerEvents': 'none',
    'visibility': 'hidden'
  }
}

const resourceToColor = (nodes) => {
  let nodesResource = nodes.map(x => x.tag)  // list of all resources
  nodesResource = [...new Set(nodesResource)] // unique resource

  let resourceColor = {}
  if (nodesResource.length <= colorPalette.length) {
    for (let i = 0; i < nodesResource.length; ++i)
      resourceColor[nodesResource[i]] = colorPalette[i]
  }
  else {
    let color = d3.scale.category20();
    for (let i = 0; i < nodesResource.length; ++i)
      resourceColor[nodesResource[i]] = color(nodesResource[i])
  }
  return resourceColor
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  fullHeight: {
    height: "500px",
  },
}));



const VisualizeView = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    async parseFile(api_id) {
      setErrorMessage(null)
      let svgElement = document.getElementById("svgd3")
      if (svgElement) svgElement.remove();

      if (api_id) {
        let params = { 'api_ops_id': api_id }
        let sankey_result = await axios.get(Constants.localURL + '/sankey', { params: params });
        sankey_result = sankey_result.data

        if (sankey_result.success && sankey_result.data) {
          setSankeyData(sankey_result.data.graph)
          if (sankey_result.data && sankey_result.data.tags) {
            setTags(sankey_result.data.tags)
          }

          if (sankey_result.data && sankey_result.data.graph) {
            setGraph(sankey_result.data.graph[0]);
            if (sankey_result.data.graph[0]) {
              setFilterTag([sankey_result.data.graph[0]["tag"]]);
            }
          }
        }
        else {
          setErrorMessage(sankey_result.message)
        }
      }
    }
  }));

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fullHeightPaper = clsx(classes.paper, classes.fullHeight);

  const sections = [
    { title: 'Visualize', url: '#' },
    { title: 'Virtualize', url: '#' },
    { title: 'Test', url: '#' },
    { title: 'Data', url: '#' },
    { title: 'Security', url: '#' },
    { title: 'Performance', url: '#' },
    { title: 'Monitor', url: '#' }
  ];


  //const [parsed, setParsed] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [graph, setGraph] = useState(null)
  const [filterTag, setFilterTag] = useState(null)
  const [sankeyData, setSankeyData] = useState(null)
  const [tags, setTags] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGraphUpdate = (filters) => {
    let newGraph = {}
    let newNodes = []
    let newLinks = []

    for (let s = 0; s < sankeyData.length; ++s) {
      let stag = sankeyData[s]["tag"]
      let snodes = sankeyData[s]["nodes"]
      let slinks = sankeyData[s]["links"]

      if (filters.indexOf(stag) > -1) {
        for (let i = 0; i < snodes.length; ++i) {
          newNodes.push(snodes[i])
        }
        for (let i = 0; i < slinks.length; ++i) {
          newLinks.push(slinks[i])
        }
      }
    }

    newGraph = { "nodes": newNodes, "links": newLinks }
    setGraph(newGraph)
  }

  /* const selectCheckBoxes = (item) => {
    let index = filterTag.indexOf(item)
    return index > -1 ? true : false
  } */

  const handleCheckboxes = (item) => {
    let index = filterTag.indexOf(item)
    let newFilterTag = index > -1 ? filterTag.filter((e) => (e !== item)) : [...filterTag, item]
    setFilterTag(newFilterTag)
    handleGraphUpdate(newFilterTag)
  }

  const authenticateUser = (result) => {
    setIsLoggedIn(result);
  };
  
  useEffect(() => {
    if (graph != null) {
      // render the new d3 chart every time with graph data
      // remove if there is any previous render
      let svgElement = document.getElementById("svgd3")
      if (svgElement) svgElement.remove();


      let sankeyGraph = { ...graph }
      let svg = d3.select(svgRef.current)
        .append("svg")
        .attr("id", "svgd3")

      let tooltip = d3.select(tooltipRef.current)
        .attr("class", "tooltip")

      let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1300 - margin.left - margin.right,
        height = 740 - margin.top - margin.bottom;

      // append the svg canvas to the page
      svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      // Set the sankey diagram properties
      let sankey = d3sankey()
        .nodeWidth(36)
        .nodePadding(12)
        .size([width, height]);

      let path = sankey.link();
      let resourceColor = resourceToColor(sankeyGraph.nodes)

      let nodeMap = {};
      sankeyGraph.nodes.forEach(function (x) { nodeMap[x.name] = x; });
      sankeyGraph.links = sankeyGraph.links.map(function (x) {
        return {
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          value: x.value
        };
      });

      sankey
        .nodes(sankeyGraph.nodes)
        .links(sankeyGraph.links)
        .layout(32);

      //let text = 
      svg.selectAll("text")
        .data(apiops_types)
        .enter().append("text")
        .attr("x", function (d, i) { return i === 0 ? 0 : width / 6 * i * 1.1 + sankey.nodeWidth() })
        .attr("y", function (d, i) { return 20 })
        .attr("fill", "#000")
        .text(function (d) { return d })
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("text-decoration", "underline");

      // add in the links
      let link = svg.append("g").selectAll(".link")
        .data(sankeyGraph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke", function (d) {
          return d3.rgb(255, 255, 255).darker(0.5);
        })
        .sort(function (a, b) { return b.dy - a.dy; });

      // add in the nodes
      let node = svg.append("g").selectAll(".node")
        .data(sankeyGraph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.behavior.drag()
          .origin(function (d) { return d; })
          .on("dragstart", function () {
            this.parentNode.appendChild(this);
          })
          .on("drag", dragmove));

      // add the rectangles for the nodes
      node.append("rect")
        .attr("height", function (d) { return d.dy; })
        .attr("width", function (d) {
          return sankey.nodeWidth()
        })
        .style("fill", function (d) {
          return d.color = resourceColor[d.tag]
        })
        .on("mouseover", function (d) { tooltip.text(d.summary); return tooltip.style("visibility", "visible"); })
        .on("mousemove", function () { return tooltip.style("top", (d3.event.y - 28) + "px").style("left", (d3.event.x) + "px"); })
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden")
        })
        .attr("stroke", "black")

      node.append("text")
        .attr("x", -6)
        .style("fill", "black")
        .attr("y", function (d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) { return d.name.split("|")[0]; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr("transform",
          "translate(" + (
            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x)) // d3.event
          ) + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))  // d3.event
          ) + ")");
        sankey.relayout();
        link.attr("d", path);
      }
    }
  }, [graph])

  const renderGraph = () => {
    let sankeyGraph = { ...graph }
      let svg = d3.select(svgRef.current)
        .append("svg")
        .attr("id", "svgd3")

      let tooltip = d3.select(tooltipRef.current)
        .attr("class", "tooltip")

      let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1300 - margin.left - margin.right,
        height = 740 - margin.top - margin.bottom;

      // append the svg canvas to the page
      svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      // Set the sankey diagram properties
      let sankey = d3sankey()
        .nodeWidth(36)
        .nodePadding(12)
        .size([width, height]);

      let path = sankey.link();
      let resourceColor = resourceToColor(sankeyGraph.nodes)

      let nodeMap = {};
      sankeyGraph.nodes.forEach(function (x) { nodeMap[x.name] = x; });
      sankeyGraph.links = sankeyGraph.links.map(function (x) {
        return {
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          value: x.value
        };
      });

      sankey
        .nodes(sankeyGraph.nodes)
        .links(sankeyGraph.links)
        .layout(32);

      //let text = 
      svg.selectAll("text")
        .data(apiops_types)
        .enter().append("text")
        .attr("x", function (d, i) { return i === 0 ? 0 : width / 6 * i * 1.1 + sankey.nodeWidth() })
        .attr("y", function (d, i) { return 20 })
        .attr("fill", "#000")
        .text(function (d) { return d })
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("text-decoration", "underline");

      // add in the links
      let link = svg.append("g").selectAll(".link")
        .data(sankeyGraph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke", function (d) {
          return d3.rgb(255, 255, 255).darker(0.5);
        })
        .sort(function (a, b) { return b.dy - a.dy; });

      // add in the nodes
      let node = svg.append("g").selectAll(".node")
        .data(sankeyGraph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.behavior.drag()
          .origin(function (d) { return d; })
          .on("dragstart", function () {
            this.parentNode.appendChild(this);
          })
          .on("drag", dragmove));

      // add the rectangles for the nodes
      node.append("rect")
        .attr("height", function (d) { return d.dy; })
        .attr("width", function (d) {
          return sankey.nodeWidth()
        })
        .style("fill", function (d) {
          return d.color = resourceColor[d.tag]
        })
        .on("mouseover", function (d) { tooltip.text(d.summary); return tooltip.style("visibility", "visible"); })
        .on("mousemove", function () { return tooltip.style("top", (d3.event.y - 28) + "px").style("left", (d3.event.x) + "px"); })
        .on("mouseout", function () {
          return tooltip.style("visibility", "hidden")
        })
        .attr("stroke", "black")

      node.append("text")
        .attr("x", -6)
        .style("fill", "black")
        .attr("y", function (d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) { return d.name.split("|")[0]; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr("transform",
          "translate(" + (
            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x)) // d3.event
          ) + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))  // d3.event
          ) + ")");
        sankey.relayout();
        link.attr("d", path);
      }
  }

  return (
    <Paper className={fullHeightPaper}>
      {tags &&
        filterTag &&
        tags.map((item, t) => (
          <label key={t}>
            {item}
            <input
              type="checkbox"
              name={item}
              checked={filterTag.indexOf(item) > -1}
              onChange={() => handleCheckboxes(item)}
            />
          </label>
        ))}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <div ref={svgRef} style={{ height: "100%", width: "100%" }}></div>
      <div ref={tooltipRef} style={styles.tooltip}></div>
    </Paper>
  );
});

export default VisualizeView;