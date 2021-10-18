import useSize from '@react-hook/size';
import React from 'react';
import Plot from 'react-plotly.js';
import * as tf from '@tensorflow/tfjs';

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
  const [xy, setXY] = React.useState<Float32Array>();

  // const result = new Float32Array(2 * drops.length);

  React.useEffect(() => {
    // https://trinket.io/embed/python3/a5bd54189b
    // https://en.wikibooks.org/wiki/Fractals/Iterations_of_real_numbers/r_iterations
    const N_iterations = 2000;
    const N_points = 10000;
    const rValues = tf.linspace(1, 4, N_points).arraySync();
    const xValues = tf.randomUniform([100]).arraySync() as number[];
    // const xValues = tf.linspace(0, 1, 100).arraySync() as number[];

    const points = new Float32Array(2 * N_points * N_iterations);
    const x0 = 0.5;

    // for (let i = 0; i < xValues.length; i++) {
    //   let x = xValues[i];

    //   for (let j = 0; j < rValues.length; j++) {
    //     let r = rValues[j];

    //     for (let k = 0; k < N_iterations; k++) {
    //       x = r * x * (1 - x);

    //       // if (k < 100) continue;

    //       // points[i * j * k * 2] = r;
    //       // points[i * j * k * 2 + 1] = x;
    //     }
    //     points[i * j * 2] = r;
    //     points[i * j * 2 + 1] = x;
    //   }
    // }

    let counter = 0;
    for (let i = 0; i < N_points; i++) {
      let r = rValues[i];
      let x = x0; //xValues[i];

      for (let k = 0; k < N_iterations; k++) {
        x = r * x * (1 - x);

        if (k < 100) continue;

        // points[i * k * 2] = r;
        // points[i * k * 2 + 1] = x;
        points[counter] = r;
        counter++;
        points[counter] = x;
        counter++;
      }
      // points[counter] = r;
      // counter++;
      // points[counter] = x;
      // counter++;

      // points[i * 2] = r;
      // points[i * 2 + 1] = x;
    }

    setXY(points);

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

  console.log(xy);

  return (
    <div ref={containerRef} style={{ height: '100vh', width: '100vw' }}>
      <Plot
        data={[
          {
            xy: xy,
            type: 'pointcloud',
            marker: { color: 'black' },
          },
          // {
          //   xy: xy(dropsInside),
          //   type: "pointcloud",
          //   name: "Inside",
          //   marker: { color: "blue" },
          // },
          // {
          //   xy: xy(dropsOutside),
          //   name: "Outside",
          //   type: "pointcloud",
          //   marker: { color: "red" },
          // },
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
          width: width,
          height: height,
          autosize: true,
          margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
          },
          // showlegend: false,
          // uirevision: false,
          // hovermode: false,
          // annotations: [
          //   {
          //     xref: "paper",
          //     yref: "paper",
          //     x: 1,
          //     xanchor: "right",
          //     y: 1,
          //     yanchor: "bottom",
          //     text: `Outside: ${dropsOutside.length}`,
          //     showarrow: false,
          //     font: {
          //       size: 14,
          //       color: "red",
          //     },
          //   },
          //   {
          //     xref: "paper",
          //     yref: "paper",
          //     x: 0,
          //     xanchor: "left",
          //     y: 1,
          //     yanchor: "bottom",
          //     text: `Inside: ${dropsInside.length}`,
          //     showarrow: false,
          //     font: {
          //       size: 14,
          //       color: "blue",
          //     },
          //   },
          // ],
        }}
        config={
          {
            // displayModeBar: false,
          }
        }
      />
    </div>
  );
}

export default App;
