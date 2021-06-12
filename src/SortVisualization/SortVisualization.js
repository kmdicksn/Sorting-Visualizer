import React from 'react';
import './SortVisualization.css';
import { BarChart, Bar, ResponsiveContainer } from "recharts";

//Array Definitions
const MAX = 1000;
const MIN = -500;
const SIZE = 50;

var working = false;

/*
Taken from: https://stackoverflow.com/questions/22815790/set-a-delay-timeout-inside-a-double-nested-loop
Credit to: Yoshi, https://stackoverflow.com/users/697154/yoshi
*/
var delayed = (function() {
    var queue = [];
  
    /*
    Processes queued functions with delay.
    */
    function processQueue() {
      if (queue.length > 0) {
        working = true;
        setTimeout(function () {
          if (queue.length == 1) {
            working = false;
          }
          queue.shift().cb();
          processQueue();
        }, queue[0].delay);
      }
    }
  
    return function delayed(delay, cb) {
      queue.push({ delay: delay, cb: cb });
  
      if (queue.length === 1) {
        processQueue();
      }
    };
}());

export default class SortVisualization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            //disables buttons when working
            disabled: false
        };
    }

    randomIntFromInterval(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        for (let i = 0; i < SIZE; i++) {
            array.push(this.randomIntFromInterval(MAX,MIN));
        }
        this.setState({array});
        console.log(array);
    }

    /*
    Sorts array using Bubble Sort and logs the swaps to a queue for delayed processing to be displayed.
    */
    bubbleSort() {
        var temp_array = this.state.array.slice();
        let swaps = 0;
        let comparisons = 0;

        this.state.disabled = true;
        for (let i = 0 ; i < SIZE - 1 ; i++) {
            for (let j = 0 ; j < SIZE - i - 1; j++) {
                if (temp_array[j] > temp_array[j + 1]) {
                    //log required swaps necessary for sorted array
                    console.log("swapping:" + String(j), String(j+1));
                    swaps += 1;
                    let temp = temp_array[j + 1];
                    temp_array[j+1] = temp_array[j];
                    temp_array[j] = temp;
                    //implement the swaps in the displayed array
                    delayed(3000/SIZE, function(j, graph) {
                        return function() {
                            console.log("actually swapping:" + String(j), String(j+1));
                            let temp = graph.state.array[j+1];
                            graph.state.array[j+1] = graph.state.array[j];
                            graph.state.array[j] = temp;
                            console.log(graph.state.array);
                            graph.setState(graph.state.array);
                            //reenable control panel when sorting done
                            if (!working) {
                                graph.state.disabled = true;
                                graph.setState();
                            }
                        };
                    }(j, this));
                }
            }
        }
        console.log(temp_array);
    }

    /*
    Sorts array using Insertion Sort and logs the swaps to a queue for delayed processing to be displayed.
    */
    insertionSort() {
        var temp_array = this.state.array.slice();
        let i, key, j; 
        this.state.disabled = true;
        for (i = 1; i < SIZE; i++) { 
            key = temp_array[i];
            j = i - 1; 
            while (j >= 0 && temp_array[j] > key) { 
                temp_array[j + 1] = temp_array[j]; 
                //log swaps to queue
                delayed(3000/SIZE, function(j, graph) {
                    return function() {
                        console.log("actually swapping:" + String(j), String(j+1));
                        graph.state.array[j + 1] = graph.state.array[j];
                        graph.setState(graph.state.array);
                        //reenable control panel when sorting done
                        if (!working) {
                            graph.state.disabled = true;
                            graph.setState();
                        }
                    };
                }(j, this));
                j = j - 1; 
            } 
            temp_array[j + 1] = key; 
            //log swaps to queue
            delayed(3000/SIZE, function(j, key, graph) {
                return function() {
                    console.log("actually swapping:" + String(j), String(j+1));
                    graph.state.array[j + 1] = key;
                    console.log(graph.state.array);
                    graph.setState(graph.state.array);
                    //reenable control panel when sorting done
                    if (!working) {
                        graph.state.disabled = true;
                        graph.setState();
                    }
                };
            }(j, key, this));
        } 
        console.log("TEMP:" + String(temp_array));
    }



    render() {
        const data = this.state.array.map(x => ({out : x}));

        return (
            <fragment>
            <div className = "control_panel">
                <button onClick={() => this.resetArray()} disabled={working}>Reset Chart</button>
                <button onClick={() => this.insertionSort()} disabled={working}>Insertion Sort</button>
                <button onClick={() => this.bubbleSort()} disabled={working}>Bubble Sort</button>
            </div>
            <ResponsiveContainer width="80%" height={600} className = "main-graph">
            <BarChart data={data} margin={{ top: 0, left: 0, right: 200, bottom: 0 }}><Bar dataKey="out" fill= "#63bce9" />
            </BarChart>
            </ResponsiveContainer>
            <div className = "separator">
                
            </div>
            </fragment>
        );
    }
}