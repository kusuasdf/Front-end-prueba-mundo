import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Paper, Typography } from '@mui/material';

export default function SelectAutoWidth() {
    const [regions, setRegion] = React.useState([]);
    const [selectedRegion, setSelectedRegion] = React.useState('');
    const [provincias, setProvincias] = React.useState([]);
    const [selectedProvincia, setSelectedProvincia] = React.useState('');
    const [ciudades, setCiudades] = React.useState([]);
    const [selectedCiudad, setSelectedCiudad] = React.useState('');
    const [success, setsuccess] = React.useState(false);
    const [error, seterror] = React.useState(false);
    const [calle, setCalle] = React.useState('');
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        Axios.get('http://127.0.0.1:8000/api/regiones')
            .then(res => setRegion(res.data))
            .catch(err => console.log(err));
    }, []);


    const regionChange = (event) => {
        setSelectedRegion(event.target.value);
        setProvincias([]);
        setCiudades([]);
        Axios.get('http://127.0.0.1:8000/api/regiones/' + event.target.value)
            .then(res => setProvincias(res.data))
            .catch(err => console.log(err));
        setSelectedProvincia('');
        setSelectedCiudad('');
    };

    const provinciaChange = (event) => {
        setSelectedProvincia(event.target.value);
        setCiudades([]);
        Axios.get('http://127.0.0.1:8000/api/provincias/' + event.target.value)
            .then(res => setCiudades(res.data))
            .catch(err => console.log(err));
        setSelectedCiudad('');
    };


    const submit = () => (
        
        Axios.post('http://127.0.0.1:8000/api/calles', {
            ciudad_id: selectedCiudad,
            CAL_NAME: calle
        })
            .then(res => {
                if(res.status === 200){ 
                    seterror(false);
                    setsuccess(true);
                    setCalle('');
                    setCiudades([]);
                    setSelectedCiudad('');
                    setSelectedProvincia('');
                    setProvincias([]);
                    setSelectedRegion('');
                    setTimeout(() => {
                        setsuccess(false);
                    }, 3000);
                }
                else{
                    setsuccess(false);
                    setMessage('Error al guardar la calle, Intente nuevamente');
                    seterror(true);
                    setTimeout(() => {
                        seterror(false);
                    }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
                setsuccess(false);
                setMessage("Todos los campos son obligatorios.");
                seterror(true);
                setTimeout(() => {
                    seterror(false);
                }, 3000);
            })
    
    )


    return (
        <Paper elevation={4} sx={{
            overflow: 'visible',
            display:'flex', 
            flexDirection:'column', 
            alignContent:'center',
            height:'100%',
            padding: '1rem'
            }}>
            <Collapse in={success}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setsuccess(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    Calle ingresada correctamente
                </Alert>
            </Collapse>
            <Collapse in={error}>
                <Alert severity='error'
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                seterror(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>
            </Collapse>
            <Typography  variant="h4" align='center' gutterBottom >Agregar calle</Typography>
            <Typography  variant="h6" align='center' gutterBottom >Ingrese los datos para la nueva calle</Typography>
            <FormControl required sx={{ m: 1,  marginBottom:2, marginTop:2 }}>
                <InputLabel id="region-label">Region</InputLabel>
                <Select
                    labelId="region-label"
                    id="Region selector"
                    value={selectedRegion}
                    onChange={regionChange}
                    
                    label="Regions"
                >
                    {regions.map(region => {
                        return (
                            <MenuItem sx={{width:'100%'}} key={region.id} value={region.id}>
                                {region.REG_NAME}
                            </MenuItem>)
                    })}
                </Select>
            </FormControl>
            <FormControl required sx={{ m: 1,  marginBottom:2 }}>
                <InputLabel  id="provincia-label">Provincia</InputLabel>
                <Select
                    labelId="provincia-label"
                    id="provincia selector"
                    value={selectedProvincia}
                    onChange={provinciaChange}
                    label="provincias"
                    disabled={!selectedRegion ?? false}
                >
                    {provincias.map(provincia => {
                        return (
                            <MenuItem sx={{width:'100%'}} key={provincia.id} value={provincia.id}>
                                {provincia.PROV_NAME}
                            </MenuItem>)
                    })}

                </Select>
            </FormControl>
            <FormControl required sx={{ m: 1,  marginBottom:2 }}>
                <InputLabel id="ciudad-label">Ciudad</InputLabel>
                <Select
                    labelId="ciudad-label"
                    id="ciudad selector"
                    value={selectedCiudad}
                    onChange={(event) => setSelectedCiudad(event.target.value)}
                    label="ciudades"
                    disabled={(!selectedRegion || !selectedProvincia) ?? false}
                >
                    {ciudades.map(ciudad => {
                        return (
                            <MenuItem sx={{width:'100%'}} key={ciudad.id} value={ciudad.id}>
                                {ciudad.CIU_NAME}
                            </MenuItem>)
                    })}
                </Select>
            </FormControl>
            <FormControl required sx={{ m: 1,  marginBottom:2 }}>
            <TextField onChange={(event)=>setCalle(event.target.value)} id="calle" label="Ingrese Calle" variant="filled" value={calle} />
            </FormControl>
            <FormControl required sx={{ m: 1, alignItems:'center' }}>
            <Button sx={{width:'50%'}} onClick={()=>submit()} variant="outlined" color="primary"><SaveIcon />Guardar Calle</Button>
            </FormControl>
        </Paper>
    );
}
