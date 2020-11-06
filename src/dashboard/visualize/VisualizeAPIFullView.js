import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';
import { Constants } from '../../Constants';
import Axios from 'axios';
import VisualizeView from './VisualizeView';
import VisualizeViewNew from './VisualizeViewFull';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function VisualizeAPIFullView(props) {
  const classes = useStyles();
  const VisualViewRef = React.useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sankeyResult, setSankeyResult] = useState(null);

  useEffect(() => {
    async function getSankeyData(api_id) {
        //let params = { 'api_ops_id': props.selectedAPI }
        let params = { 'api_ops_id': api_id }
        let sankey_result = await Axios.get(Constants.localURL + '/sankey', { params: params })
        sankey_result = sankey_result.data;

        if (sankey_result.success) {
          setSankeyResult(sankey_result);
          //VisualViewRef.current.parseFile(sankey_result);
          /* setSankeyData(sankey_result.data.graph)
          setTags(sankey_result.data.tags)
          setGraph(sankey_result.data.graph[0])
          setFilterTag([sankey_result.data.graph[0]['tag']]) */
        }
        else {
          setErrorMessage(sankey_result.message);
        }
    }
    
    if (props.selectedAPI && props.selectedAPI.api_ops_id && props.selectedAPI.api_ops_id != '') {
      setErrorMessage('');
      getSankeyData(props.selectedAPI.api_ops_id);
    } else {
      setErrorMessage("API-OPS-ID is mising.")
    }
    
  }, [props.selectedAPI]);

  return (
    <div>
      <Dialog fullScreen open={props.isFullScreen} onClose={props.handleCloseFullscreen} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" onClick={props.handleCloseFullscreen} aria-label="close">
              <CloseIcon />
            </IconButton>
            {props.selectedAPI && props.selectedAPI.name != '' ? (
              <Typography className={classes.title}>
                {props.selectedAPI.name}
              </Typography>
            ):(
              ""
            )}
            
            <Button autoFocus color="inherit" onClick={props.handleCloseFullscreen}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <VisualizeViewNew ref={VisualViewRef} sankey_data={sankeyResult}/>
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    latestAPI: state.authReducer.selectedAPI
  };
};

const mapDispatchToProps = dispatch => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(VisualizeAPIFullView)