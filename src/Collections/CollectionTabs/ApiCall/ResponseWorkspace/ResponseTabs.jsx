import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import httpStatus from 'http-status-codes';
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import JsonEditor from '../components/JsonEditor';
import ResponseHeader from './ResponseHeader';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tab: {
        minWidth: 100,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'none',
    },
    panel: {
        padding: theme.spacing(2),
        borderBottom: '1px solid #ddd',
        borderTop: '1px solid #ddd',
    },
    span: {
        fontWeight: 600,
        fontSize: '12px',
        display: 'inline-block',
        marginLeft: '10px',
    },
    iconSpan: {
        width: '50px',
        fontSize: '12px',
        display: 'inline-block',
        marginRight: '10px',
        marginBottom: '10px',
    },
    launchButton: {
        color: '#FF5F9E',
        borderRadius: theme.shape.borderRadius,
        padding: '2px',
        '&:hover': {
            backgroundColor: 'transparent',
        },
        fontSize: '5px',
    },
    launchTooltip: {
        fontSize: '13px',
        backgroundColor: '#FF5F9E',
    },
    launchArrow: {
        color: '#FF5F9E',
    },
}));

export default function ResponseTabs({ doc, response, loading }) {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    let statusText;
    if (response && response.status) {
        statusText = httpStatus.getStatusText(response.status);
    } else {
        statusText = 'Error';
    }
    const handleChange = (event, newValue) => {
        setSelectedTabIndex(newValue);
    };

    const classes = useStyles();
    // function onTabChange() {
    //   const queryParams = new URLSearchParams({
    //     doc: doc,
    //     response: JSON.stringify(response),
    //   }).toString();
    //   if (response.data) {
    //     window.open(`${routes.responseTab}?${queryParams}`, "_blank");
    //   }
    // }

    return (
        <div>
            <div className="flex justify-between ">
                <Tabs
                    value={selectedTabIndex}
                    onChange={handleChange}
                    variant="standard"
                    indicatorColor="transparent"
                    textColor="primary"
                >
                    <Tab className={classes.tab} label="Response Body" />
                    {response &&
                    response.data &&
                    Object.keys(response.data).length &&
                    Object.keys(response.headers).length > 0 ? (
                        <Tab className={classes.tab} label="Response Header" />
                    ) : null}
                </Tabs>
                {response && response.status && response.size && response.time ? (
                    <div className="flex mt-4 mr-4">
                        <span className={classes.span}>
                            Status:
                            <span
                                style={{
                                    color: response.status >= 200 && response.status < 300 ? '#138808' : 'red',
                                }}
                            >
                                {response.status ? `${response.status} ${statusText}` : ''}
                            </span>
                        </span>
                        <span className={classes.span}>
                            Time:
                            <span
                                style={{
                                    color: response.status >= 200 && response.status < 300 ? '#138808' : 'red',
                                }}
                            >
                                {response.time ? ` ${response.time}s` : ''}
                            </span>
                        </span>
                        <span className={classes.span}>
                            Size:
                            <span
                                style={{
                                    color: response.status >= 200 && response.status < 300 ? '#138808' : 'red',
                                }}
                            >
                                {response.size ? ` ${response.size}kB` : ''}
                            </span>
                        </span>
                        {/* <span className={classes.iconSpan}>
            <Tooltip
              title="Open a new tab"
              classes={{
                tooltip: classes.launchTooltip,
                arrow: classes.launchArrow,
              }}
              arrow
              enterDelay={300}
              leaveDelay={100}
              placement="top"
            >
              <IconButton className={classes.launchButton} onClick={onTabChange}>
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          </span> */}
                    </div>
                ) : null}
            </div>

            <div className="px-4 py-4 ">
                {loading ? (
                    <ThreeDots height="30" width="30" color="gray" visible={true} />
                ) : (
                    <>
                        {selectedTabIndex === 0 && doc && (
                            <JsonEditor
                                value={doc !== undefined || null ? JSON.parse(doc) : {}}
                                readOnly={true}
                                type={'responseTab'}
                            />
                        )}
                        {selectedTabIndex === 1 && <ResponseHeader response={response} />}
                    </>
                )}
            </div>
        </div>
    );
}
