https://www.ag-grid.com/react-data-grid/component-cell-renderer/#example-cell-renderer-summary

React Data Grid
Cell Components

react logoReact
Custom HTML / DOM inside Cells is achieved using Cell Components. Create Custom Cell Components to have any HTML markup in a cell. The grid comes with some Provided Cell Components for common grid tasks.

React Cell Renderers thumbnail
The example below shows adding images, hyperlinks, and buttons to a cell using Custom Cell Components. The custom button logs to the developer console when clicked.

"E:\Backup\Área de Trabalho\XIAOMI\project\project\shopmi\public\Screenshot_1.jpg"


//style.css

.example-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

//myGrid {
    flex: 1 1 0px;
    width: 100%;
}

.logo {
    display: block;
    width: 90px;
    height: auto;
    margin-right: 12px;
    filter: brightness(1.1);
}

.imgSpan {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
}

.imgSpanLogo {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.missionSpan {
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
}

.missionIcon {
    width: auto;
    height: auto;
}

.priceIcon {
    display: block;
    width: 15px;
    height: auto;
    max-height: 50%;
    margin-right: 2px;
}

.logoCell {
    background-color: #fff3;
}

//companyLogoRenderer.jsx

import React from 'react';

export default (params) => (<span className="imgSpanLogo">
        {params.value && (<img alt={`${params.value} Flag`} src={`https://www.ag-grid.com/example-assets/software-company-logos/${params.value.toLowerCase()}.svg`} className="logo"/>)}
    </span>);


//companyRenderer.jsx

import React from 'react';

export default (params) => {
    return (<a href={params.value} target="_blank">
            {new URL(params.value).hostname}
        </a>);
};

//customButtonComponent.jsx
import React from 'react';

export default ({ data }) => {
    return (<button onClick={() => console.log('Software Launched')}>
            {data?.company ? `Launch ${data.company}!` : 'Launch!'}
        </button>);
};

//missionResultRenderer.jsx
import React from 'react';

export default ({ data }) => {
    return (<button onClick={() => console.log('Software Launched')}>
            {data?.company ? `Launch ${data.company}!` : 'Launch!'}
        </button>);
};

//missionResultRenderer.jsx

import React from 'react';

export default ({ data }) => {
    return (<button onClick={() => console.log('Software Launched')}>
            {data?.company ? `Launch ${data.company}!` : 'Launch!'}
        </button>);
};


//priceRenderer.jsx

import React from 'react';

export default ({ data }) => {
    return (<button onClick={() => console.log('Software Launched')}>
            {data?.company ? `Launch ${data.company}!` : 'Launch!'}
        </button>);
};

//index.jsx

("use client");

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import CompanyLogoRenderer from "./companyLogoRenderer.jsx";
import CompanyRenderer from "./companyRenderer.jsx";
import CustomButtonComponent from "./customButtonComponent.jsx";
import MissionResultRenderer from "./missionResultRenderer.jsx";
import PriceRenderer from "./priceRenderer.jsx";

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 10,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "company",
      flex: 6,
    },
    {
      field: "website",
      cellRenderer: CompanyRenderer,
    },
    {
      headerName: "Logo",
      field: "company",
      cellRenderer: CompanyLogoRenderer,
      cellClass: "logoCell",
      minWidth: 100,
    },
    {
      field: "revenue",
      cellRenderer: PriceRenderer,
    },
    {
      field: "hardware",
      cellRenderer: MissionResultRenderer,
    },
    {
      colId: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
    },
  ]);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/small-company-data.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


//useFetchJson.jsx
import { useState, useEffect } from 'react';

/**
 * Fetch example Json data
 * Not recommended for production use!
 */
export const useFetchJson = (url, limit) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            // Note error handling is omitted here for brevity
            const response = await fetch(url);                
            const json = await response.json();
            const data = limit ? json.slice(0, limit) : json;
            setData(data);
            setLoading(false);
        };
        fetchData();
    }, [url, limit]);
    return { data, loading };
};

Provided Components
Copy Link
The grid comes with some built in Cell Components that cover some common cell rendering requirements.

Group Cell Component (https://www.ag-grid.com/react-data-grid/grouping-single-group-column/#cell-component): For showing group details with expand and collapse functionality when using any of Row Grouping (https://www.ag-grid.com/react-data-grid/grouping/), Master Detail (https://www.ag-grid.com/react-data-grid/master-detail/)or Tree Data (https://www.ag-grid.com/react-data-grid/tree-data/).

Animate Change Cell Renderers (https://www.ag-grid.com/react-data-grid/change-cell-renderers/#animated-cell-renderers): For animating changes when data is updated.

Checkbox Cell Renderer (https://www.ag-grid.com/react-data-grid/cell-data-types/#boolean): For displaying boolean values with a checkbox when cellDataType of Boolean is used.



Custom Components
Copy Link
The Component is provided props containing, amongst other things, the value to be rendered.

// this comp gets inserted into the Cell
const CustomButtonComp = props => {
    return <>{props.value}</>;
};
Properties available on the CustomCellRendererProps<TData = any, TValue = any, TContext = any> interface.

value
Copy Link
TValue | null | undefined
Value to be rendered.
valueFormatted
Copy Link
string | null | undefined
Formatted value to be rendered.
fullWidth
Copy Link
boolean
True if this is a full width row.
pinned
Copy Link
'left' | 'right' | null
Pinned state of the cell.
data
Copy Link
TData | undefined
The row's data. Data property can be undefined when row grouping or loading infinite row models.
node
Copy Link
IRowNode
The row node.
colDef
Copy Link
ColDef
The cell's column definition.
column
Copy Link
Column
The cell's column.
eGridCell
Copy Link
HTMLElement
The grid's cell, a DOM div element.
eParentOfValue
Copy Link
HTMLElement
The parent DOM item for the cell renderer, same as eGridCell unless using checkbox selection.
getValue
Copy Link

Function
Convenience function to get most recent up to data value.
getValue = () => TValue  |  null  |  undefined;
setValue
Copy Link

Function
Convenience function to set the value.
setValue = (
    value: TValue  |  null  |  undefined
) => void;
formatValue
Copy Link

Function
Convenience function to format a value using the column's formatter.
formatValue = (
    value: TValue  |  null  |  undefined
) => string;
refreshCell
Copy Link

Function
Convenience function to refresh the cell.
refreshCell = () => void;
registerRowDragger
Copy Link

Function
registerRowDragger:
rowDraggerElement The HTMLElement to be used as Row Dragger
dragStartPixels The amount of pixels required to start the drag (Default: 4)
value The value to be displayed while dragging. Note: Only relevant with Full Width Rows.
suppressVisibilityChange Set to true to prevent the Grid from hiding the Row Dragger when it is disabled.
registerRowDragger = (
    rowDraggerElement: HTMLElement,
    dragStartPixels?: number,
    value?: string,
    suppressVisibilityChange?: boolean
) => void;
setTooltip
Copy Link

Function
Sets a tooltip to the main element of this component.
value The value to be displayed by the tooltip
shouldDisplayTooltip A function returning a boolean that allows the tooltip to be displayed conditionally. This option does not work when enableBrowserTooltips={true}.
setTooltip = (
    value: string,
    shouldDisplayTooltip?: () => boolean
) => void;
api
Copy Link
GridApi
The grid api.
context
Copy Link
TContext
Application context as set on gridOptions.context.
Note that if Row Selection is enabled, it is recommended to set suppressKeyboardEvent on the column definition to prevent the ␣ Space key from triggering both row selection and toggling the checkbox.

Selecting Components
Copy Link
The Cell Component for a Column is set via colDef.cellRenderer and can be any of the following types:

String: The name of a registered Cell Component, see Registering Custom Components
Component: Direct reference to a Cell Component.
Inlined Component: An inlined Cell Component.
The code snippet below demonstrates each of these method types.

const [columnDefs] = useState([
    // 1 - String - The name of a Cell Component registered with the grid.
    {
        field: 'age',
        cellRenderer: 'agGroupCellRenderer',
    },
    // 2 - Component - Provide your own Cell Component directly without registering.
    {
        field: 'sport',
        cellRenderer: MyCustomCellRendererClass,
    },
    // 3 - Inlined Component
    {
        field: 'year',
        cellRenderer: props => {
            // put the value in bold
            return <>Value is <b>{params.value}</b></>;
        }
    }
]);
Dynamic Component Selection
Copy Link
The colDef.cellRendererSelector function allows setting different Cell Components for different Rows within a Column.

The params passed to cellRendererSelector are the same as those passed to the Cell Renderer Component. Typically the selector will use this to check the row's contents and choose a renderer accordingly.

The result is an object with component and params to use instead of cellRenderer and cellRendererParams.

This following shows the selector choosing between Mood and Gender Cell Renderers based on the row data.

cellRendererSelector: params => {

    const type = params.data.type;

    if (type === 'gender') {
        return {
            component: GenderCellRenderer,
            params: {values: ['Male', 'Female']}
        };
    }

    if (type === 'mood') {
        return {
            component: MoodCellRenderer
        };
    }

    return undefined;
}
Another use case for the Selector function is to only render a custom cell component in leaf nodes when Row Grouping. This is done by checking params.node.group and returning undefined for the group nodes.

cellRendererSelector: params => {
    return params.node.group ? undefined : { component: CellRenderer };
},

Accessing Instances
Copy Link
After the grid has created an instance of a Cell Component for a cell it is possible to access that instance. This is useful if you want to call a method that you provide on the Cell Component that has nothing to do with the operation of the grid. Accessing Cell Components is done using the grid API getCellRendererInstances(params).

getCellRendererInstances
Copy Link

Function
Returns the list of active cell renderer instances.
RenderApiModule
An example of getting the Cell Component for exactly one cell is as follows:

// example - get cell renderer for first row and column 'gold'
const firstRowNode = api.getDisplayedRowAtIndex(0);
const params = { columns: ['gold'], rowNodes: [firstRowNode] };
const instances = api.getCellRendererInstances(params);

if (instances.length > 0) {
    // got it, user must be scrolled so that it exists
    const instance = instances[0];
}
Note that this method will only return instances of the Cell Component that exists. Due to Row and Column Virtualisation, Cell Components will only exist for Cells that are within the viewport of the Vertical and Horizontal scrolls.

The example below demonstrates custom methods on Cell Components called by the application. The following can be noted:

The medal columns are all using the user defined MedalCellRenderer. The Cell Component has an arbitrary method medalUserFunction() which prints some data to the developer console.
The Gold button executes a method on all instances of the Cell Component in the gold column and prints the data to the developer console.
The First Row Gold button executes a method on the gold cell of the first row only and prints data to the developer console. Note that the getCellRendererInstances() method will return nothing if the grid is scrolled far past the first row showing row virtualisation in action.
The All Cells button executes a method on all instances of all Cell Components and prints data to the developer console.


Custom Props
Copy Link
The props passed to the Cell Component can be complemented with custom props. This allows configuring reusable Cell Components - e.g. a component could have buttons that are optionally displayed via additional props.

Complement props to a cell renderer using the Column Definition attribute cellRendererParams. When provided, these props will be merged with the grid provided props.

// define Cell Component to be reused
const ColourCellComp = props => <span style={{color: props.color}}>{props.value}</span>;

const GridExample = () => {
  const [columnDefs] = useState([
       {
           headerName: "Colour 1",
           field: "value",
           cellRenderer: ColourCellComp,
           cellRendererParams: {
              color: 'guinnessBlack'
           }
       },
       {
           headerName: "Colour 2",
           field: "value",
           cellRenderer: ColourCellComp,
           cellRendererParams: {
              color: 'irishGreen'
           }
       }
  ]);

  //...
};

Dynamic Tooltips
Copy Link
When working with Custom Cell Renderers it is possible to register custom tooltips that are displayed dynamically by using the setTooltip method.

Properties available on the CustomCellRendererProps<TData = any, TValue = any, TContext = any> interface.

setTooltip
Copy Link

Function
Sets a tooltip to the main element of this component.
value The value to be displayed by the tooltip
shouldDisplayTooltip A function returning a boolean that allows the tooltip to be displayed conditionally. This option does not work when enableBrowserTooltips={true}.

Defer Slow Cell Components
Copy Link
If a Custom Cell Component is slow to render, the grid may appear unresponsive due to the custom component blocking the main thread. This can be avoided by deferring the rending of slow components as follows:

{
    cellRenderer: 'SlowCellRenderer',
    cellRendererParams: {
        deferRender: true
    }
}
Deferred components will be rendered after other cells and only after the grid has stopped scrolling. In the meantime, the loading cell renderer will be displayed. If Row Grouping is active only custom cells in leaf nodes will be deferred.

The example below demonstrates the use of deferRender to defer the rendering of an artificially slow cell component. The following can be noted when scrolling:

The column 'Slow Renderer' is deferred and shows the default skeleton cell loader.
The column 'Slow Renderer Custom' is deferred but uses a custom loading cell defined via colDef.loadingCellRenderer.
The column 'Fast Renderer' is a custom component but not deferred so renders immediately along with the other plain cells.
The cellRendererSelector only returns the Slow Cell Renderer for leaf nodes as an optimisation.

deferRender uses startTransition to reduce the priority of deferred components. There is a known limitation in React that transitions are currently batched together meaning all deferred components appear at the same time. For more information, see the React documentation StartTransition - Caveats.

Lazy Loading Cell Components
Copy Link
The grid supports lazy loading of Custom Cell Components by displaying the loadingCellRenderer until the custom cell has loaded.

The example below uses React.lazy to load the cell component for the Lazy Loaded Renderer column with an artificial delay of 3 seconds.


Keyboard Navigation
Copy Link
When using custom Cell Components, the custom Cell Component is responsible for implementing support for keyboard navigation among its focusable elements. This is why by default, focusing a grid cell with a custom Cell Component will focus the entire cell instead of any of the elements inside the custom cell renderer.

In order to handle focus in your custom cell component, implement Custom Cell Component Keyboard Navigation (https://www.ag-grid.com/react-data-grid/keyboard-navigation/#custom-cell-component).