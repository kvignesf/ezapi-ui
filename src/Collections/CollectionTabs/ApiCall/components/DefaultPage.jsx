import { makeStyles } from '@material-ui/core';
import imageLogo from '../../../../static/images/logo/ConekttoLogoWithText.png';

const useStyles = makeStyles((theme) => ({
    logo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    shortcutsContainer: {
        marginTop: theme.spacing(10),
        textAlign: 'left',
    },
    shortcut: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1),
    },
    shortcutKey: {
        fontWeight: 'bold',
        marginRight: theme.spacing(1),
    },
    ctrlContainer: {
        display: 'flex',
        alignItems: 'center',
        background: '#D8D8D8',
        width: 'fit-content',
        height: '27px',
        borderRadius: '5px',
        border: '1px solid grey',
        marginRight: '10px',
    },
    spanCtrl: {
        padding: '3px',
        color: 'grey',
        fontWeight: 'bold',
        fontSize: '10px',
    },
    letterContainer: {
        display: 'flex',
        alignItems: 'center',
        background: '#D8D8D8',
        width: 'fit-content',
        padding: '5px',
        height: '27px',
        borderRadius: '5px',
        border: '1px solid grey',
        marginRight: '10px',
    },
    letterSpan: {
        padding: '3px',
        color: 'grey',
        fontWeight: 'bold',
        fontSize: '10px',
    },
}));
export default function DefaultPage() {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.logo}>
                <img
                    src={imageLogo}
                    alt="conektto logo"
                    className="p-1"
                    style={{ maxHeight: '55px', padding: '1px' }}
                />
                <h1 style={{ fontSize: '15px' }}>Collections</h1>
            </div>

            <div className={classes.shortcutsContainer}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                    <div className={classes.ctrlContainer}>
                        <span className={classes.spanCtrl}>CTRL</span>
                    </div>
                    <div>
                        <span style={{ color: 'black', marginRight: '5px', fontSize: '12px', fontWeight: 500 }}>+</span>
                    </div>
                    <div className={classes.letterContainer}>
                        <span className={classes.letterSpan}>A</span>
                    </div>
                    <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>
                        - Add New Request
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                    <div className={classes.ctrlContainer}>
                        <span className={classes.spanCtrl}>CTRL</span>
                    </div>
                    <div>
                        <span style={{ color: 'black', marginRight: '5px', fontSize: '12px', fontWeight: 500 }}>+</span>
                    </div>
                    <div className={classes.letterContainer}>
                        <span className={classes.letterSpan}>D</span>
                    </div>
                    <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>
                        - Close Current Tab
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <div className={classes.ctrlContainer}>
                    <span className={classes.spanCtrl}>CTRL</span>
                </div>
                <div>
                    <span style={{ color: 'black', marginRight: '5px', fontSize: '12px', fontWeight: 500 }}>+</span>
                </div>
                <div className={classes.letterContainer}>
                    <span className={classes.letterSpan}>←</span>
                </div>
                <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>
                    - Switch to Left Tab
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <div className={classes.ctrlContainer}>
                    <span className={classes.spanCtrl}>CTRL</span>
                </div>
                <div>
                    <span style={{ color: 'black', marginRight: '5px', fontSize: '12px', fontWeight: 500 }}>+</span>
                </div>
                <div className={classes.letterContainer}>
                    <span className={classes.letterSpan}>→</span>
                </div>
                <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>
                    - Switch to Right Tab
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <div className={classes.ctrlContainer}>
                    <span className={classes.spanCtrl}>CTRL</span>
                </div>
                <div>
                    <span style={{ color: 'black', marginRight: '5px', fontSize: '12px', fontWeight: 500 }}>+</span>
                </div>
                <div className={classes.letterContainer}>
                    <span className={classes.letterSpan}>S</span>
                </div>
                <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>
                    - Save Request
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <div className={classes.ctrlContainer}>
                    <span className={classes.spanCtrl}>ENTER</span>
                </div>
                <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>
                    - Send Request
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                <div className={classes.ctrlContainer}>
                    <span className={classes.spanCtrl}>CTRL</span>
                </div>
                <div>
                    <span style={{ color: 'black', marginRight: '5px', fontSize: '12px', fontWeight: 500 }}>+</span>
                </div>
                <div className={classes.letterContainer}>
                    <span className={classes.letterSpan}>I</span>
                </div>
                <span style={{ color: 'grey', marginTop: '5px', fontSize: '12px', fontWeight: 500 }}>- Import</span>
            </div>
        </div>
    );
}
