//the two global variables responsible for the parameters of the GLCM matrix
let d = 1;
let angle = 0;
let inputMatrix = [];

//This method generates a 5 by 6 input matrix and assigns a random value [1, 8] into each field
function generateInputMatrix()
{
  let matrix = [];
  for(let i = 0; i < 5; ++i)
  {
    let row = [];
    for(let j = 0; j < 6; ++j)
    {
      row[j] = getRndInteger(1, 8);
    }
    matrix.push(row);
  }
  return matrix;
}

//this function generates an empty glcm matrix where every field is set to 0
function generateGLCMMatrix()
{
  let matrix = [];
  for(let i = 0; i < 8; ++i)
  {
    let row = [];
    for(let j = 0; j < 8; ++j)
    {
      row[j] = 0;
    }
    matrix.push(row);
  }
  return matrix;
}

//this method fills the empty glcm matrix with actual values
function fillGLCMMatrix(inputMatrix, glcmMatrix)
{
  //calculate the rowChange and colChange based on the two variables: d and angle
  let rowChange = (angle == 0 || angle == 180) ? 0 : ((angle > 0 && angle < 180) ? -d : d);
  let colChange = (angle == 0 || angle == 45 || angle == 315) ? d : ((angle == 90 || angle == 270) ? 0 : -d);
  //go through every row of the input matrix
  for(let i = 0; i < 5; ++i)
  {
    //we will be changing rows during assigning, only iterate through valid rows
    if(i+rowChange >= 0 && i+rowChange < 5)
    {
      //go through every column of the row
      for(let j = 0; j < 6; ++j)
      {
        //we might change columns during assigning, only iterate through valid cols
        if(j+colChange >= 0)
        {
          //remove 1 because the array offset is from 0 to 7 while the numbers are from 1 to 8
          //find the first element in the row
          let row = inputMatrix[i][j]-1;
          //find the corresponding element determined by the d and angle variables
          //at this point we know this element exists because the rowChange and colChange were both filtered
          let col = inputMatrix[i+rowChange][j+colChange]-1;
          //add the result to the glcm matrix
          glcmMatrix[row][col]++;
        }
      }
    }
  }
  return glcmMatrix;
}

//This function creates a HTML table and appends it to a div, one table for each matrix
function tableCreate(glcmMatrix = [])
{
  //m = 0 means input Matrix
  //m = 1 means glcm matrix
  for(let m = 0; m < 2; ++m)
  {
    if(m == 0)
    {
      //create the table element
      const tbl = document.createElement('table');
      tbl.id = "InputMatrixTable";
      tbl.style.width = '250px';
      tbl.style.border = '1px solid black';

      //create table rows
      for (let i = 0; i < inputMatrix.length; i++)
      {
        const tr = tbl.insertRow();
        //for each row create the columns
        for (let j = 0; j < inputMatrix[0].length; j++)
        {
            const td = tr.insertCell();
            td.appendChild(document.createTextNode(inputMatrix[i][j]));
            td.style.border = '1px solid black';
            td.style.width = '40px';
            td.style.height = '40px';
            td.style.textAlign = 'center';
            td.style.fontSize = '22px';
            td.dataset.row = i+1;
            td.dataset.col = j+1;
        }
      }
      //add the table to the document
      InputMatrix.appendChild(tbl);
    }
    else
    {
      //create the table element
      const tbl = document.createElement('table');
      tbl.id = "GlcmMatrixTable";
      tbl.style.width = '350px';
      tbl.style.border = '1px solid black';

      //create table rows
      for (let i = 0; i < glcmMatrix.length; i++)
      {
        const tr = tbl.insertRow();
        //for each row create the columns
        for (let j = 0; j < glcmMatrix.length; j++)
        {
            const td = tr.insertCell();
            td.appendChild(document.createTextNode(glcmMatrix[i][j]));
            td.style.border = '1px solid black';
            td.style.width = '40px';
            td.style.height = '40px';
            td.style.textAlign = 'center';
            td.style.fontSize = '22px';
            td.dataset.row = i+1;
            td.dataset.col = j+1;
            //add the highlightInputs function call to the onclick event of each element
            td.onclick = function(){highlightInputs(this.dataset.row, this.dataset.col)};
        }
      }
      //add the table to the document
      GLCMMatrix.appendChild(tbl);
    }
  }
}

//this function, once a value in glcm matrix is clicked,  highlight the two corresponding values in the input matrix
function highlightInputs(row, col)
{
  //adjust the row in which we are looking for the value equal to the column
  //d can be visualised as a gap between the current number and the required number
  let rowChange = (angle == 0 || angle == 180) ? 0 : ((angle > 0 && angle < 180) ? -d : d);
  let colChange = (angle == 0 || angle == 45 || angle == 315) ? d : ((angle == 90 || angle == 270) ? 0 : -d);
  //iterate through the input matrix
  for(let i = 0; i < 5; ++i)
  {
    //if the angle change means a scanning row change, ignore the first d rows of the input matrix
    if(i+rowChange >= 0 && i+rowChange < 5)
    {
      for(let j = 0; j < 6; ++j)
      {
        if(j+colChange >= 0)
        {
          //if the corresponding glcm rows and col is found, proceed to highlight
          if(inputMatrix[i][j] == row && inputMatrix[i+rowChange][j+colChange] == col)
          {
            //highlight the starting element
            let firstElementRow = i+1;
            let firstElementCol = j+1;
            const elementA = InputMatrix.querySelectorAll("[data-row='"+firstElementRow+"'][data-col='"+firstElementCol+"']");
            elementA[0].style.backgroundColor = "#FDFF47";
            //highlight the ending element
            let secondElementRow = i+1+rowChange;
            let secondElementCol = j+1+colChange;
            const elementB = InputMatrix.querySelectorAll("[data-row='"+secondElementRow+"'][data-col='"+secondElementCol+"']");
            elementB[0].style.backgroundColor = "#FDFF47";
            //highlight the elements in the GLCM matrix
            const elementC = GLCMMatrix.querySelectorAll("[data-row='"+row+"'][data-col='"+col+"']");
            elementC[0].style.backgroundColor = "#FDFF47";
          }
        }
      }
    }
  }
}

//Runs the methods that create and display the matrices on launch and on parameter change
function initApp(firstLaunch = true)
{
  //when angle or d is changed the old matrices are removed
  if(!firstLaunch)
  {
    InputMatrix.removeChild(document.getElementById('InputMatrixTable'));
    GLCMMatrix.removeChild(document.getElementById('GlcmMatrixTable'));
  }
  inputMatrix = generateInputMatrix();
  let glcmMatrix = generateGLCMMatrix();
  let filledGLCMMatrix = fillGLCMMatrix(inputMatrix, glcmMatrix);
  tableCreate(glcmMatrix);
}

//sets the d parameter
function setGap(gap)
{
  d = gap;
  initApp(false);
}

//sets the angle parameter
function setAngle(ang)
{
  angle = ang;
  initApp(false);
}

// Returns a random integer from min to max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//initializes the app when this script file is loaded
initApp();
