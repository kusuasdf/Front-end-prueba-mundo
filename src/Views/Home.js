import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Lista from "./Listado"
import Create from "./Create"
import { Container } from '@mui/material';
import './Views.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component={"span"}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Box sx={{ height:'100vh', overflow:()=>{
            if(window.innerHeight<=600){
                return 'scroll'
            }
            else{
                return 'hidden'
                };
        } }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs centered variant='fullWidth' value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab  label="Listado de Calles" {...a11yProps(0)} />
                    <Tab  label="Agregar Calle" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <div className="base">
                <Container>
                    <Box>
                        <TabPanel value={value} index={0}>
                            <Lista />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Create />
                        </TabPanel>
                    </Box>
                </Container>
            </div>
        </Box>
    );
}
