import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';



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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = React.useState([]);
    const [openEdit, setopenEdit] = React.useState(false);
    const [openDelete, setopenDelete] = React.useState(false);
    const [edit, setEdit] = React.useState('');
    const [newName, setNewName] = React.useState('');
    const [regions, setRegion] = React.useState([]);
    const [selectedRegion, setSelectedRegion] = React.useState('');
    const [provincias, setProvincias] = React.useState([]);
    const [selectedProvincia, setSelectedProvincia] = React.useState('');
    const [ciudades, setCiudades] = React.useState([]);
    const [selectedCiudad, setSelectedCiudad] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const regionChange = (event) => {
        setSelectedRegion(event.target.value);
        Axios.get('http://127.0.0.1:8000/api/regiones/' + event.target.value)
            .then(res => setProvincias(res.data))
            .catch(err => console.log(err));
        setSelectedProvincia('');
        setSelectedCiudad('');
    };

    const provinciaChange = (event) => {
        setSelectedProvincia(event.target.value);
        Axios.get('http://127.0.0.1:8000/api/provincias/' + event.target.value)
            .then(res => setCiudades(res.data))
            .catch(err => console.log(err));
        setSelectedCiudad('');
    };

    const prepareProvincias = (event) => {
        Axios.get('http://127.0.0.1:8000/api/regiones/' + data.find(x => x.id == event.target.id).region.id)
            .then(res => setProvincias(res.data))
            .then(() => {
                setSelectedProvincia(data.find(x => x.id == event.target.value).provincia.id);
                prepareCiudades(event);
            })
            .catch(err => console.log(err));
        setSelectedCiudad('')
    };

    const prepareCiudades = (event) => {
        Axios.get('http://127.0.0.1:8000/api/provincias/' + data.find(x => x.id == event.target.id).provincia.id)
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
                setSelectedRegion(data.find(x => x.id == event.target.id).region.id);
                prepareProvincias(event);
                setEdit(event.target.id);
                setopenEdit(true);
            })
            .catch(err => console.log(err));
    };

    const editDialogClose = () => {
        setopenEdit(false);
        setEdit('');
        setNewName('');
        setSelectedRegion('');
        setSelectedProvincia('');
        setSelectedCiudad('');
    };

    const editSave = (event) => {
        Axios.put('http://127.0.0.1:8000/api/calles/' + edit, {
            CAL_NAME: newName,
            pt_ciudad_id: selectedCiudad,
        })
            .then(res => {
                editDialogClose();
                setMessage('Calle editada con éxito');
                setError(false);
                setSuccess(true);
                dataUpdate();
            })
            .catch(err => {
                console.log(err);
                setSuccess(false);
                setMessage('Error al editar calle');
                setError(true);
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
        setEdit('');
    };

    const deleteSave = (event) => {
        Axios.delete('http://127.0.1:8000/api/calles/' + edit)
            .then(res => {
                deleteDialogClose();
                setMessage('Calle eliminada con éxito');
                setError(false);
                setSuccess(true);
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

    React.useEffect(() => {
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
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            height: '80vh',
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
                    sx={{ mb: 2, paddingBottom: 2 }}
                >
                    {message}
                </Alert>
            </Collapse>
            <TableContainer >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
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
                                        <TableCell>{datas.region.REG_NAME}</TableCell>
                                        <TableCell>{datas.provincia.PROV_NAME}</TableCell>
                                        <TableCell>{datas.ciudad.CIU_NAME}</TableCell>
                                        <TableCell>{datas.CAL_NAME}</TableCell>
                                        <TableCell align='center' maxwidth='12%'  >
                                            <Button id={datas.id} value={datas.id} onClick={editDialogOpen} variant="outlined"> Editar</Button>
                                            <Button value={datas.id} color="error" variant='outlined' onClick={deleteDialogOpen}> Eliminar</Button>
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
                    <FormControl required sx={{ m: 1, Width: '100%', marginBottom: 2 }}>
                        <InputLabel id="region-label">Region</InputLabel>
                        <Select
                            labelId="region-label"
                            id="Region selector"
                            value={selectedRegion}
                            onChange={regionChange}
                            autoWidth
                            label="Regions"
                        >
                            {regions.map(region => {
                                return (
                                    <MenuItem key={region.id} value={region.id}>
                                        {region.REG_NAME}
                                    </MenuItem>)
                            })}
                        </Select>
                    </FormControl>
                    <FormControl required sx={{ m: 1, width:'100%', marginBottom: 2 }}>
                        <InputLabel id="provincia-label">Provincia</InputLabel>
                        <Select
                            labelId="provincia-label"
                            id="provincia selector"
                            value={selectedProvincia}
                            onChange={provinciaChange}
                            autoWidth
                            label="provincias"
                        >
                            {provincias.map(provincia => {
                                return (
                                    <MenuItem key={provincia.id} value={provincia.id}>
                                        {provincia.PROV_NAME}
                                    </MenuItem>)
                            })}

                        </Select>
                    </FormControl>
                    <FormControl required sx={{ m: 1, width:'100%', marginBottom: 2,  }}>
                        <InputLabel id="ciudad-label">Ciudad</InputLabel>
                        <Select
                            labelId="ciudad-label"
                            id="ciudad selector"
                            value={selectedCiudad}
                            onChange={(event) => setSelectedCiudad(event.target.value)}
                            autoWidth
                            label="ciudades"
                        >
                            {ciudades.map(ciudad => {
                                return (
                                    <MenuItem key={ciudad.id} value={ciudad.id}>
                                        {ciudad.CIU_NAME}
                                    </MenuItem>)
                            })}
                        </Select>
                    </FormControl>
                    <FormControl required sx={{ m: 1, width:'100%', marginBottom: 2 }}>
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
