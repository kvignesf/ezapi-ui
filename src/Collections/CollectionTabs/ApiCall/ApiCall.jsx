import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isSaveModalOpen } from '../../CollectionsAtom';
import Request from './RequestWorkspace/RequestPanel';
import Response from './ResponseWorkspace/ResponsePanel';

const useStyles = makeStyles((theme) => ({
    requestContainer: {
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f2f2f2',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c9c9c9',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a6a6a6',
        },
    },
    responseContainer: {
        height: `calc(100% - 50px)`,
        backgroundColor: 'white',
        zIndex: 1,
        maxHeight: '80vh',
        overflow: 'hidden',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f2f2f2',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c9c9c9',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a6a6a6',
        },
    },
    resizeBar: {
        backgroundColor: '#E6E7E5',
        height: '2px',
        position: 'absolute',
        left: '0',
        right: '0',
        cursor: 'row-resize',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
            height: '5px',
            backgroundColor: '#20262E',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#20262E',
        },
    },
}));

export default function ApiCall() {
    const classes = useStyles();
    const [height, setHeight] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [prevY, setPrevY] = useState(0);
    const setSaveModalOpen = useSetRecoilState(isSaveModalOpen);

    const onMouseDown = (event) => {
        event.preventDefault();
        setIsResizing(true);
        setPrevY(event.clientY);
    };

    const onMouseUp = () => {
        setIsResizing(false);
    };

    const onMouseMove = (event) => {
        if (isResizing) {
            requestAnimationFrame(() => {
                const newHeight = height + (event.clientY - prevY);
                setHeight(newHeight);
                setPrevY(event.clientY);
            });
        }
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault(); // Prevent browser's default Save dialog
                // Call your function here
                setSaveModalOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (
        <div className="flex bg-white">
            <div className="w-full">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                    }}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                >
                    <div className={classes.requestContainer} style={{ height: `${height}px` }}>
                        <Request setLoading={setLoading} />
                    </div>
                    <div className={classes.responseContainer}>
                        <div className={classes.resizeBar} onMouseDown={onMouseDown} />
                        <Response loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
