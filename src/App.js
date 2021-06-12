import logo from './logo.svg';
import './App.css';
import SortVisualization from './SortVisualization/SortVisualization.js';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import { Fragment } from 'react';

function App() {
  return (
    <fragment>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet"></link>
    </head>
    <div className = "header">
      <h1>Sorting Visualizer</h1>
    </div>
    <div className = "graph">
      <SortVisualization> </SortVisualization>  
    </div>
    <footer className = "footer">

    </footer>
    </fragment>
  );
}

export default App;
