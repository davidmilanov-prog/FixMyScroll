import React, {
  useState,
  useMemo,
} from 'react';

import {
  Box,
  Toolbar,
  Typography,
  Button,
  Popover,
  Tabs,
  Tab,
  IconButton,

} from '@mui/material';

import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import MenuIcon from '@mui/icons-material/Menu';
import { CompactPicker } from 'react-color';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  CellStyleModule,
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  TextEditorModule,
  DragAndDropModule,
  RowDragModule,
  RowApiModule,
  DateEditorModule,
  RenderApiModule,
  EventApiModule,
  ColumnApiModule,
  SelectEditorModule,
  RowSelectionModule,
  PinnedRowModule,
  TooltipModule,
  themeQuartz,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './DispatchSheet.css';

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  TextEditorModule,
  DragAndDropModule,
  RowDragModule,
  RenderApiModule,
  RowApiModule,
  DateEditorModule,
  EventApiModule,
  ColumnApiModule,
  SelectEditorModule,
  PinnedRowModule,
  RowSelectionModule,
  TooltipModule
]);

const myTheme = themeQuartz.withParams({
  headerColumnBorder: { color: 'black' },
  headerColumnBorderHeight: '80%',
  fontFamily: [
    "Arial",
    "sans-serif"
  ],
  headerBackgroundColor: "rgb(200,200,200)",
  suppressDragLeaveHidesColumns: 'true',
  suppressMoveWhenRowDragging: 'true'
});

const DaySection = React.memo(function DaySection({
  outboundRowData,
  inboundRowData,
  driversColumnDefs,
  inboundColumnDefs,
  outboundColumnDefs,
  defaultColDef,
  onCellContextMenu,
  theme
}) {
  const finalDriverRows = []
  const sharedGridOptions = useMemo(
    () => ({
      defaultColDef,
      sideBar: false,
      rowHeight: 20,
      headerHeight: 0,
      suppressRowTransform: true,
      suppressNoRowsOverlay: true,
      domLayout: 'autoHeight',
      rowDragManaged: true,
    }),
    [ defaultColDef ]
  );
  const addDummyRows = (rows, type = 'default') => {
    const initialRows = Array.isArray(rows) ? rows : [];
    const dummyRows = Array.from({ length: 20 }, (_, index) => ({
      id: `dummy-${ type }-${ index }`,
      isEmpty: true,
    }));
    return [ ...initialRows, ...dummyRows ];
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        mt: 1,
        alignItems: 'stretch',
        width: '100%',
        borderBottom: '3px solid cyan',
        minWidth: '2000px',
        maxWidth: '2000px',
      }}
    >

      <Box
        sx={{
          width: '49px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRight: '1px solid gray',
          backgroundColor: '#fff',
          position: 'sticky',
          left: '0',
          zIndex: 1
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontSize: '0.8rem', color: 'black', height: '20px !important' }}
        >
          Day
        </Typography>
      </Box>


      {/* DRIVERS GRID */}
      <Box
        className={`ag-theme-alpine no-header-day-grid`}
        sx={{ width: '98px', borderRight: '3px solid cyan', minHeight: '20px !important' }}
      >

        <AgGridReact
          {...sharedGridOptions}
          getRowId={(params) => String(params.data.id)}
          rowData={addDummyRows(finalDriverRows, 'driver')}
          columnDefs={driversColumnDefs}
          theme={theme}
        />
      </Box>

      {/* OUTBOUND GRID */}
      <Box
        className={`ag-theme-alpine no-header-day-grid`}
        sx={{ width: '47.35%', borderRight: '3px solid cyan', minHeight: '20px !important' }}
      >
        <AgGridReact
          {...sharedGridOptions}
          onCellContextMenu={onCellContextMenu}
          getRowId={(params) => String(params.data.id)}
          rowData={addDummyRows(outboundRowData, 'outbound')}
          columnDefs={outboundColumnDefs}
          theme={theme}
        />
      </Box>

      {/* INBOUND GRID */}
      <Box
        className={`ag-theme-alpine no-header-day-grid`}
        sx={{ width: '47.4%', borderRight: '3px solid cyan', minHeight: '20px !important' }}
      >
        <AgGridReact
          {...sharedGridOptions}
          getRowId={(params) => String(params.data.id)}
          rowData={addDummyRows(inboundRowData, 'inbound')}
          columnDefs={inboundColumnDefs}
          theme={theme}
        />
      </Box>
    </Box>
  );
});

const DispatchSheet = () => {
  const [ showSunday, setShowSunday ] = useState(true);
  const [ showSaturday, setShowSaturday ] = useState(true);
  const theme = useMemo(() => {
    return myTheme;
  }, []);

  const defaultColDef = useMemo(
    () => ({
      editable: true,
      resizable: true,
      menuTabs: [],
      rowHeight: 20,
      pinnedRowCellHeight: 20,
      cellStyle: (params) => {
        const { data, colDef } = params;
        const customStyles = data?.styles?.[ colDef.field ] || {};

        return {
          padding: '4px',
          fontWeight: 'bold',
          fontSize: '12px',
          ...customStyles,
          color: '#68BC00',
        };
      },

      headerStyle: { padding: '4px' },
    }),
    []
  );

  const driversColumnDefs = useMemo(() => [
    {
      field: 'move',
      headerName: '',
      rowDrag: true,
      editable: false,
      resizable: false,
      flex: 2,
      cellStyle: { padding: '4px', textAlign: 'left' },
      lockPosition: 'left',
    },
  ], []);

  const inboundColumnDefs = useMemo(() => [
    {
      field: 'move',
      headerName: '',
      rowDrag: true,
      editable: false,
      cellStyle: { padding: '4px', textAlign: 'left' },
      dndSource: (params) => !params.data.isEmpty,
      lockPosition: 'left',
      resizable: false,
      flex: 6,
    },
  ], []);

  const outboundColumnDefs = useMemo(() => [
    {
      field: 'move',
      headerName: '',
      rowDrag: true,
      editable: false,
      cellStyle: { padding: '4px', textAlign: 'left' },
      lockPosition: 'left',
      resizable: false,
      flex: 6,
    },
  ], []);

  const finalDays = [ 0, 1, 2, 3, 4, 5, 6 ];

  return (
    <Box>
      <Box >
        <Box id="dispatchNavBar">
          {/* Top bar (row 1) */}
          <Toolbar
            sx={{
              width: '100%',
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 'small',
              minHeight: 'auto !important'
            }}
          >
            <Typography variant="h6">Dispatch Sheet - Date</Typography>
            <Box
              sx={{}}>
              <Button
                variant={'contained'}
              >
                Extra Empty
              </Button>
              <Button
                onClick={() => setShowSunday(!showSunday)}
                variant={showSunday ? 'contained' : 'outlined'}
              >
                Sunday
              </Button>
              <Button
                onClick={() => setShowSaturday(!showSaturday)}
                variant={showSaturday ? 'contained' : 'outlined'}
              >
                Saturday
              </Button>
              <Button
                variant={'outlined'}
              >
                Assign Mode
              </Button>
            </Box>
          </Toolbar>

          {/* Second bar (row 2) */}
          <Toolbar
            sx={{
              width: '100%',
              height: 40,
              backgroundColor: '#fff',
              borderBottom: '1px solid #ccc',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              paddingX: 1,
              minHeight: 'auto !important'
            }}
          >
            {/* LEFT SIDE ICONS */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<UndoIcon />}
              />
              <Button
                variant="outlined"
                startIcon={<RedoIcon />}
              />
            </Box>

            {/* Right side toolbar items */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                marginLeft: 'auto',
                alignItems: 'center'
              }}
            >
              Items
            </Box>
          </Toolbar>
          <Popover
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <CompactPicker />
          </Popover>
        </Box>
      </Box>

      {/* mid content */}

      <Box className="scrollable-container" sx={{
        height: '100%',
        position: 'relative',
        height: 'calc(100vh - 175px)',
        overflow: 'scroll',
        position: 'relative',
        display: 'block'
      }}>

        <Box className='scrollable-container-tabs' sx={{
          width: '100%',
          display: 'flex',
          position: 'sticky',
          top: '0',
          zIndex: 2,
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white !important',
            minWidth: '2000px'
          }}>
            <Box sx={{
              width: '48px',
              minWidth: '48px',
              backgroundColor: '#fff',
              borderRight: '1px solid gray',
              borderBottom: '3px solid cyan',
              position: 'sticky',
              top: '0',
              left: '0',
              zIndex: '3',
            }}>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '0.8rem', paddingLeft: '10px', marginTop: '4px', marginBottom: '4px' }}>
                Drivers
              </Typography>

              {/* DRIVERS Header Grid */}
              <Box
                className="ag-theme-alpine main-day-grid"
                sx={{ width: '96px', borderRight: '3px solid cyan', borderBottom: '3px solid cyan' }}
              >
                <AgGridReact
                  columnDefs={driversColumnDefs}
                  rowData={[]}
                  defaultColDef={defaultColDef}
                  theme={theme}
                  rowHeight={0}
                  domLayout="autoHeight"
                />
              </Box>
            </Box>


            {/* OUTBOUND Header Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '47.35%;', }}>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '0.8rem', paddingLeft: '10px', marginTop: '4px', marginBottom: '4px' }}>
                Outbound
              </Typography>
              <Box
                className="ag-theme-alpine main-day-grid"
                sx={{ width: '100%', borderRight: '3px solid cyan', borderBottom: '3px solid cyan' }}
              >
                <AgGridReact
                  columnDefs={outboundColumnDefs}
                  rowData={[]}
                  defaultColDef={defaultColDef}
                  theme={theme}
                  rowHeight={0}
                  domLayout="autoHeight"
                />
              </Box>
            </Box>

            {/* INBOUND Header Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '47.35%;' }}>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '0.8rem', paddingLeft: '10px', marginTop: '4px', marginBottom: '4px' }}>
                Inbound
              </Typography>
              <Box
                className="ag-theme-alpine main-day-grid"
                sx={{ width: '100%', borderRight: '3px solid cyan', borderBottom: '3px solid cyan' }}
              >
                <AgGridReact
                  columnDefs={inboundColumnDefs}
                  rowData={[]}
                  defaultColDef={defaultColDef}
                  rowHeight={0}
                  theme={theme}
                  domLayout="autoHeight"
                />
              </Box>

            </Box>

          </Box>

        </Box>


        {finalDays.map(() => {
          return (
            <DaySection
              driversColumnDefs={driversColumnDefs}
              inboundColumnDefs={inboundColumnDefs}
              outboundColumnDefs={outboundColumnDefs}
              defaultColDef={defaultColDef}
              theme={theme}
            />
          )
        }
        )}
      </Box>

      <Box
        sx={{
          width: '100%', backgroundColor: 'rgb(250,250,250)', position: 'relative',
          display: 'block', borderTop: '2px solid rgb(200,200,200)',
          display: "flex"
        }}
      >
        <IconButton sx={{ ml: 1, height: '30px' }}>
          <MenuIcon />
        </IconButton>
        <Tabs
          variant="scrollable"
          scrollButtons="on"
          sx={{
            borderLeft: '2px solid rgb(200,200,200)',
            minHeight: '30px',
            '& .MuiTab-root': {
              minHeight: '30px',
              padding: '0 8px'
            }
          }}
          TabIndicatorProps={{ style: { backgroundColor: '#68BC00' } }}
        >
          <Tab label="Tab 1" disabled />
          <Tab label="Tab 2" disabled />
          <Tab label="Tab 3" disabled />
          <Tab label="Tab 4" disabled />
          <Tab label="Tab 5" disabled />
        </Tabs>
      </Box>
    </Box >
  );
};

export default DispatchSheet;