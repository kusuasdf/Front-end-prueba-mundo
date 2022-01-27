import {useState,useEffect} from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Alert,
    IconButton,
    Collapse,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Axios from 'axios';



const columns = [
    { id: 'Region', label: 'Region', minWidth: 170 },
    { id: 'Provincia', label: 'Provincia', minWidth: 100 },
    { id: 'Ciudad', label: 'Ciudad', minWidth: 170 },
    { id: 'Calle', label: 'Calle', minWidth: 170 },
    {
        id: 'Acciones',
        label: 'Acciones',
        minWidth: 170,
        maxwidth: '12%',
        align: 'center',
        format: (value) => value.toFixed(2),
    },
];


export default function StickyHeadTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [openEdit, setopenEdit] = useState(false);
    const [openDelete, setopenDelete] = useState(false);
    const [edit, setEdit] = useState('');
    const [newName, setNewName] = useState('');
    const [regions, setRegion] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [provincias, setProvincias] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [ciudades, setCiudades] = useState([]);
    const [selectedCiudad, setSelectedCiudad] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

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

    const prepareProvincias = (event) => {
        Axios.get('http://127.0.0.1:8000/api/regiones/' + data.find(x => x.id == event.target.id).ciudad.provincia.region.id)
            .then(res => setProvincias(res.data))
            .then(() => {
                setSelectedProvincia(data.find(x => x.id == event.target.value).ciudad.provincia.id);
                prepareCiudades(event);
            })
            .catch(err => console.log(err));
        setSelectedCiudad('')
    };

    const prepareCiudades = (event) => {
        Axios.get('http://127.0.0.1:8000/api/provincias/' + data.find(x => x.id == event.target.id).ciudad.provincia.id)
            .then(res => setCiudades(res.data))
            .then(() => {
                setSelectedCiudad(data.find(x => x.id == event.target.value).ciudad.id);
            })
            .catch(err => console.log(err));
    };

    const editDialogOpen = (event) => {
        Axios.get('http://127.0.0.1:8000/api/regiones/')
            .then(res => setRegion(res.data))
            .then(() => {
                setNewName(data.find(x => x.id == event.target.id).CAL_NAME);
                setSelectedRegion(data.find(x => x.id == event.target.id).ciudad.provincia.region.id);
                prepareProvincias(event);
                setEdit(event.target.id);
                setopenEdit(true);
            })
            .catch(err => console.log(err));
    };

    const editDialogClose = () => {
        setopenEdit(false);

    };

    const editSave = (event) => {
        Axios.put('http://127.0.0.1:8000/api/calles/' + edit, {
            CAL_NAME: newName,
            ciudad_id: selectedCiudad,
        })
            .then(res => {
                editDialogClose();
                setMessage('Calle editada con éxito');
                setError(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                dataUpdate();
            })
            .catch(err => {
                console.log(err);
                setSuccess(false);
                setMessage('Error al editar calle');
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
            });
    };

    const deleteDialogOpen = (event) => {
        setEdit(event.target.value);
        setError(false);
        setSuccess(false);
        setopenDelete(true);
    };

    const deleteDialogClose = () => {
        setError(false);
        setSuccess(false);
        setopenDelete(false);
    };

    const deleteSave = (event) => {
        Axios.delete('http://127.0.1:8000/api/calles/' + edit)
            .then(res => {
                deleteDialogClose();
                setMessage('Calle eliminada con éxito');
                setError(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                dataUpdate();
            })
            .catch(err => {
                console.log(err);
            });
    };

    const dataUpdate = () => {
        Axios.get('http://127.0.0.1:8000/api/calles')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        Axios.get('http://127.0.0.1:8000/api/calles')
            .then(res => setData(res.data))
    }, []);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper elevation={4} sx={{
            overflow: () => {
                if (window.innerWidth <= 500) {
                    return 'scroll'
                }
                else {
                    return 'visible'
                };
            },
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            height: '85vh',
        }}>
            <Collapse in={success}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setSuccess(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ height: '10', paddingBottom: '1' }}
                >
                    {message}
                </Alert>
            </Collapse>
            <TableContainer  >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((datas) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={datas.id}>
                                        <TableCell>{datas.ciudad.provincia.region.REG_NAME}</TableCell>
                                        <TableCell>{datas.ciudad.provincia.PROV_NAME}</TableCell>
                                        <TableCell>{datas.ciudad.CIU_NAME}</TableCell>
                                        <TableCell>{datas.CAL_NAME}</TableCell>
                                        <TableCell align='center' maxwidth='12%'  >
                                            <Button id={datas.id} value={datas.id} onClick={editDialogOpen} variant="outlined"> Editar</Button>
                                            <Button sx={{marginLeft:'4px'}} value={datas.id} color="error" variant='outlined' onClick={deleteDialogOpen}> Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Calles por página"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}   
                sx={{
                    overflow: 'visible',
                }}
            />
            <Dialog open={openEdit} onClose={editDialogClose}>
                <Collapse in={error}>
                    <Alert severity='error'
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setError(false);
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
                <DialogTitle>Editar Calle</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ingrese los nuevos datos para la calle {data.map((datas) => {
                            if (datas.id == edit) {
                                return datas.CAL_NAME
                            }
                        })}
                    </DialogContentText>
                    <FormControl required sx={{ m: 1, width: '100%', marginBottom: 2 }}>
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
                    <FormControl required sx={{ m: 1, width: '100%', marginBottom: 2 }}>
                        <InputLabel id="provincia-label">Provincia</InputLabel>
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
                    <FormControl required sx={{ m: 1, width: '100%', marginBottom: 2, }}>
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
                    <FormControl required sx={{ m: 1, width: '100%', marginBottom: 2 }}>
                        <TextField onChange={(event) => setNewName(event.target.value)} id="calle" label="Ingrese Calle" variant="filled" value={newName} />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={editDialogClose} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={editSave} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDelete} onClose={deleteDialogClose}>
                <DialogTitle>Eliminar Calle</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea eliminar la calle {data.map((datas) => {
                            if (datas.id == edit) {
                                return datas.CAL_NAME
                            }
                        })}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={deleteDialogClose} color="error">
                        Cancelar
                    </Button>
                    <Button onClick={deleteSave} color="primary">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
