import * as React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from '../config/server.config';
import Nav from './nav';
function createData(name, description, id) {
  return {
    name,
    description,
    id
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'item',
    numeric: true,
    disablePadding: false,
    label: 'Item',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: true,
    label: 'Description',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, i) => (
          <TableCell
            key={i}
            align={'center'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell style={{width:'20%'}}>
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function Items() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [item, setItem] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [flag, setFlag] = React.useState('save');
  const [rid, setRid] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [tempsRows, setTempRows] = React.useState([]);

  useEffect(() => {
    handleGetData();
  }, []);
  const handleGetData = () => {
    axios.get('/api/item/get')
      .then(function (response) {
        console.log(response);
        let itemData = response.data.data.data;
        const tempRows = [];
        for (let i = 0; i < itemData.length; i++) {
          tempRows.push(createData(itemData[i].name, itemData[i].description, itemData[i].id));
        }
        setRows(tempRows);
        setTempRows(tempRows);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeValue = (event) => {
    if (event.target.id === "item-basic") {
      setItem(event.target.value);
    } else if (event.target.id === "description-basic") {
      setDescription(event.target.value);
    } else if (event.target.id === "search-basic") {   //search
      console.log(event.target.value, rows);
      let v = event.target.value;
      let new_ary = [];
      for (let i = 0; i < tempsRows.length; i++) {
        if (tempsRows[i].name.indexOf(v) > -1 || tempsRows[i].description.indexOf(v) > -1) {
          new_ary.push(tempsRows[i]);
        }
      }
      setRows(new_ary);
    }
  }
  const handleDelete = (event) => {
    axios.post('/api/item/delete', {id: event.target.id})
      .then(function (response) {
        handleGetData();
        setItem('');
        setDescription('');
        setFlag('save');
        setRid(0);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleUpdate = (item, description, id) => {
    setFlag('update');
    setRid(id);
    setItem(item);
    setDescription(description);
  }
  const handleSave = () => {
    axios.post('/api/item/save', {
      item: item,
      description: description,
      flag: flag,
      id: rid
    })
      .then(function (response) {
        setItem('');
        setDescription('');
        setFlag('save');
        setRid(0);
        console.log(response.data.status);
        if (response.data.status === "dup") {
          alert("Duplicate...");
        }
        handleGetData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Nav></Nav>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="item-basic" onChange={handleChangeValue} value={item} label="item" variant="standard" />
          <TextField id="description-basic" onChange={handleChangeValue} value={description} label="description" variant="standard" />
          <Button variant="outlined" onClick={handleSave} style={{ marginTop: "20px" }}>Add</Button>
          <TextField id="search-basic" onChange={handleChangeValue} label="search" variant="standard" style={{ float: "right" }} />
        </Box>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id+'-'}
                    // selected={isItemSelected}
                    >
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell padding="checkbox" align='center'>
                        <Button variant="outlined" id={row.id} onClick={handleDelete}>
                          Delete
                        </Button>
                        <Button variant="outlined" id={row.id} onClick={()=>handleUpdate(row.name, row.description, row.id)}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
