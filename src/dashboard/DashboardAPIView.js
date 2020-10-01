import React, { useRef, useState,useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Header from './Header';
import UploadAPIView from './UploadAPIView';
import DownloadAPIView from './DownloadAPIView';
import VisualizeAPIView from './VisualizeAPIView';
import Header2 from './Header2';
import { AccountCircle } from '@material-ui/icons';

import * as d3 from 'd3';
import d3sankey from '../sankey';
import axios from 'axios';
import Title from './Title';
import { BottomNavigation } from '@material-ui/core';

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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://ezapi.ai/">
        EzAPI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
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

export default function DashboardAPIView(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
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

  const parseFile = async (file) => {
    setErrorMessage(null)
    // render the new d3 chart every time with graph data
    // remove if there is any previous render
    let svgElement = document.getElementById("svgd3")
    if (svgElement) svgElement.remove();

    const formData = new FormData();
    formData.append('file', file)

    let headers = { 'Content-Type': 'multipart/form-data' }
    let parsed_result = await axios.post(PARSER_URL, formData, headers)
    parsed_result = parsed_result.data;

    if (parsed_result.success) {
      setParsed(true)
      if (parsed!= null) {

      }
      let api_ops_id = parsed_result.data['api_ops_id']
      let params = { 'api_ops_id': api_ops_id }
      let sankey_result = await axios.get(VISULIZER_URL, { params: params })
      sankey_result = sankey_result.data

      if (sankey_result.success) {
        setSankeyData(sankey_result.data.graph)
        setTags(sankey_result.data.tags)
        setGraph(sankey_result.data.graph[0])
        setFilterTag([sankey_result.data.graph[0]['tag']])
      }
      else {
        setErrorMessage(sankey_result.message)
      }
    }
    else {
      setErrorMessage(parsed_result.message)
    }
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


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            EzAPI
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />

        {open ? (
          <Grid
          container
          spacing={4}
          container
          direction="column"
          justify="center"
        >
          <Grid item xs={12} md={12} lg={12}>

          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper className={fixedHeightPaper}>
              <UploadAPIView parseFile={parseFile} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper className={fixedHeightPaper}>
              <DownloadAPIView />
            </Paper>
          </Grid>
        </Grid>
        ) : (
          ""
        )}
        
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Header title="sections" sections={sections} />
            </Grid>
            {/* <Grid item xs={12} md={4} lg={3}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className={fixedHeightPaper}>
                    <UploadAPIView parseFile={parseFile} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className={fixedHeightPaper}>
                    <DownloadAPIView />
                  </Paper>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fullHeightPaper}>
                {/* <VisualizeAPIView /> */}
                <Title>Visualiza API</Title>
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
                {errorMessage && (
                  <div style={{ color: "red" }}>{errorMessage}</div>
                )}
                <div
                  ref={svgRef}
                  style={{ height: "100%", width: "100%" }}
                ></div>
                <div ref={tooltipRef} style={styles.tooltip}></div>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
