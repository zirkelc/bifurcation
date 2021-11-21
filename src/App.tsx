import useSize from '@react-hook/size';
import React from 'react';
import Plot from 'react-plotly.js';
import * as tf from '@tensorflow/tfjs';
import { useInterval } from 'usehooks-ts';

// // generate the X-Y array for the point clouds
// function xy(drops: Raindrop[]): Float32Array {
//   const result = new Float32Array(2 * drops.length);

//   for (let i = 0; i < drops.length; i++) {
//     result[i * 2] = drops[i].x;
//     result[i * 2 + 1] = drops[i].y;
//   }

//   return result;
// }

function App() {
  const containerRef = React.useRef(null);
  const [width, height] = useSize(containerRef, {
    initialWidth: 0,
    initialHeight: 0,
  });

  const [rIndex, setRIndex] = React.useState(0);
  const [timeSeriesXY, setTimeSeriesXY] = React.useState<Float32Array>();
  const [start, setStart] = React.useState(false);
  // const result = new Float32Array(2 * drops.length);

  const totalIterations = 1500;
  const skipDrawIterations = 1000;
  const drawableIterations = totalIterations - skipDrawIterations;
  const rStartValue = 1;
  const rEndValue = 4;
  const rValueStep = 0.1;
  const rValues = tf.linspace(rStartValue, rEndValue, (rEndValue - rStartValue) / rValueStep).arraySync();
  const x0 = 0.25;

  // const timeSeries
  const [bifurcationXY, setBifurcationXY] = React.useState<Float32Array>(
    new Float32Array(2 * rValues.length * drawableIterations),
  );

  useInterval(
    () => {
      const localBifurcationXY = new Float32Array(bifurcationXY.values());
      // Float32Array.from(bifurcationXY);
      // for (let i = 0; i < rValues.length; i++) {
      const localTimeSeriesXY = new Float32Array(2 * 64);
      let r = rValues[rIndex];
      let x = x0;
      console.log({ r, rIndex, x });

      for (let k = 0; k < totalIterations; k++) {
        x = r * x * (1 - x);

        if (k < 64) {
          localTimeSeriesXY[2 * k] = x;
          localTimeSeriesXY[2 * k + 1] = k;
        }

        if (k < skipDrawIterations) continue;

        // points[i * k * 2] = r;
        // points[i * k * 2 + 1] = x;
        localBifurcationXY[2 * rIndex * k] = r;
        // counter++;
        localBifurcationXY[2 * rIndex * k + 1] = x;
        // counter++;
      }
      // }

      setTimeSeriesXY(localTimeSeriesXY);
      setBifurcationXY(localBifurcationXY);
      setRIndex(rIndex + 1);

      if (rIndex === rValues.length - 1) {
        setStart(false);
      }
    },
    // Delay in milliseconds or null to stop it
    start ? 1000 : null,
  );

  React.useEffect(() => {
    // https://trinket.io/embed/python3/a5bd54189b
    // https://en.wikibooks.org/wiki/Fractals/Iterations_of_real_numbers/r_iterations
    // https://mathworld.wolfram.com/LogisticMap.html
    // const N_iterations = 1500;
    // const N_points = 1000;
    // const rValues = tf.linspace(1, 4, N_points).arraySync();
    // // const xValues = tf.randomUniform([1000]).arraySync() as number[];
    // // const xValues = tf.linspace(0, 1, 100).arraySync() as number[];
    // const points = new Float32Array(2 * N_points * N_iterations);
    // const x0 = 0.25;
    // let counter = 0;
    // for (let i = 0; i < xValues.length; i++) {
    //   for (let j = 0; j < rValues.length; j++) {
    //     let x = xValues[i];
    //     let r = rValues[j];
    //     for (let k = 0; k < N_iterations; k++) {
    //       x = r * x * (1 - x);
    //       // if (k < 100) continue;
    //       // points[i * j * k * 2] = r;
    //       // points[i * j * k * 2 + 1] = x;
    //     }
    //     points[counter] = r;
    //     counter++;
    //     points[counter] = x;
    //     counter++;
    //   }
    // }
    //
    // for (let i = 0; i < N_points; i++) {
    //   let r = rValues[i];
    //   let x = x0;
    //   for (let k = 0; k < N_iterations; k++) {
    //     x = r * x * (1 - x);
    //     if (k < 1000) continue;
    //     // points[i * k * 2] = r;
    //     // points[i * k * 2 + 1] = x;
    //     points[counter] = r;
    //     counter++;
    //     points[counter] = x;
    //     counter++;
    //   }
    // }
    // setBifurcationXY(points);
    // for r:2.5 while r <= 4.0 step 0.001 do /* min r = 1 */
    // 		(x: 0.25,
    // 		for k:1 thru 1000 do x: r * x * (1-x), /* to remove points from image compute and do not draw it */
    // 		for k:1 thru 500  do (x: r * x * (1-x), /* compute and draw it */
    //         	 	 pts: cons([r,x], pts))); /* save points to draw it later, re=r, im=x */
    // const N_steps = 500;
    // const y = tf.randomUniform([N_points]);
    // // console.log(r, y);
    // r.array();
    // y.print();
  }, []);

  const handleStart = () => setStart(true);
  const handleStop = () => setStart(false);

  return (
    <div ref={containerRef} style={{ height: '70vh', width: '100vw', display: 'flex' }}>
      <div>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <div>
        <Plot
          data={[
            {
              xy: timeSeriesXY,
              // type: 'pointcloud',
              mode: 'lines+markers',
              type: 'scatter',
              marker: { color: 'black' },
            },
          ]}
          layout={{
            xaxis: {
              range: [0, 64],
              dtick: 2,
              fixedrange: true,
              rangemode: 'nonnegative',
            },
            yaxis: {
              range: [0, 1],
              dtick: 0.2,
              fixedrange: true,
              rangemode: 'nonnegative',
            },
            width: width / 2,
            height: 600,
            autosize: true,
            margin: {
              l: 25,
              r: 25,
              b: 25,
              t: 25,
            },
          }}
        />
      </div>
      <div>
        <Plot
          data={[
            {
              xy: bifurcationXY,
              type: 'pointcloud',
              marker: { color: 'black' },
            },
          ]}
          layout={{
            xaxis: {
              range: [1, 4],
              dtick: 0.5,
              fixedrange: true,
              rangemode: 'nonnegative',
            },
            yaxis: {
              range: [0, 1],
              dtick: 0.2,
              fixedrange: true,
              rangemode: 'nonnegative',
            },
            width: width / 2,
            height: 600,
            autosize: true,
            margin: {
              l: 25,
              r: 25,
              b: 25,
              t: 25,
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
