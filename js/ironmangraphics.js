
var path;
var transformedPath;

//canvas
var canvasWidth;
var canvasHeigth;

var cameraTranslation = {x:0.0, y:0.0, z:1000.0};
var cameraScale = {x:1.0, y:1.0, z:1.0};
var cameraRotation = {x:0.0, y:0.0, z:0.0};

var position;
var pause = false;

var kFieldOfView = 1000;

var solidBlue;
var strokedBlue;
var solidStrokedBlue;

var solidRed;
var strokedRed;
var solidStrokedRed;

var solidWhite;
var strokedWhite;
var solidStrokedWhite;

var dimensionalPath;

var arc_a;
var arc_b;
var circle_a;
var circle_b;

var circle_c;
var circle_d;

var progressBar;

//private global vars
var identityMatrix_a;
var identityMatrix;
var translateMatrix;
var scaleMatrix;

var rotationMatrix_x;
var rotationMatrix_y;
var rotationMatrix_z;

var rotationMatrix_a;
var rotationMatrix_b;

var transformationMatrix;

var _pont2d_transform_ = {x:0.0, y:0.0};//for memory leaks
var _pont3d_transform_ = {x:0.0, y:0.0};//for memory leaks

var _array2d_transform_ = [0.0, 0.0, 1.0];//for memory leaks
var _array3d_transform_ = [0.0, 0.0, 0.0, 1.0];//for memory leaks

var _path_3d_List_ = [];//3d projection paths


function init3dEngine()
{
    transformationMatrix = new Matrix();
    identityMatrix_a = new Matrix();
    identityMatrix = new Matrix();
    transformationMatrix.setPerspective(kFieldOfView);

    translateMatrix = new Matrix();
    identityMatrix = new Matrix();
    scaleMatrix = new Matrix();

    rotationMatrix_a = new Matrix();
    rotationMatrix_b = new Matrix();

    rotationMatrix_x  = new Matrix();
    rotationMatrix_y = new Matrix();
    rotationMatrix_z = new Matrix();

}

function setProgress(percent)//0.0 to 1.0
{
    if(percent < 0.0)percent = 0.0;
    else if(percent > 1.0)percent = 1.0;

    progressBar.scaleX = percent;
    console.log("percent : " + percent);
}

function setCanvasSize(size)
{
    var canvas = document.getElementById('fx_wrapper');//get the canvas

    canvasWidth = canvas.width = window.innerWidth;
    canvasHeigth = canvas.height = window.innerHeight;
}


function mouseMove(mouseLocation)
{
    var limitAngle = 30;

    var xcontrollerObj = mouseLocation.x - canvasWidth/2 ;
    var ycontrollerObj = mouseLocation.y - canvasHeigth/2;

    var moveAngleY = (xcontrollerObj * (limitAngle / (canvasWidth / 2)));
    var moveAngleX = (ycontrollerObj * (limitAngle / (canvasHeigth / 2))) * -1;

    cameraRotation.x = moveAngleX * +1;
    cameraRotation.y = moveAngleY * +1;
}

function buildAssets()
{
    with(paper)
    {
        //b
        solidStrokedBlue =
        {
        fillColor: new Color(32 / 255, 230 / 255, 255 / 255, 0.5),
        strokeColor: new Color(32 / 255, 230 / 255, 255 / 255, 0.75),
        strokeWidth: 1.5,
        };

        strokedBlue =
        {
        strokeColor: new Color(32 / 255, 230 / 255, 255 / 255, 0.75),
        strokeWidth: 1.5,
        };

        solidBlue = {fillColor: new Color(32 / 255, 230 / 255, 255 / 255, 0.5)};
        solidBlueLigth = {fillColor: new Color(32 / 255, 230 / 255, 255 / 255, 0.25)};

        //r
        solidStrokedRed =
        {
        fillColor: new Color(255 / 255, 55 / 255, 40 / 255, 0.5),
        strokeColor: new Color(255 / 255, 55 / 255, 40 / 255, 0.75),
        strokeWidth: 1.5,
        };

        strokedRed =
        {
        strokeColor: new Color(255 / 255, 55 / 255, 40 / 255, 0.75),
        strokeWidth: 1.5,
        };

        solidRed =
        {
        fillColor: new Color(255 / 255, 55 / 255, 40 / 255, 0.5),
        };
        //w
        solidStrokedWhite =
        {
        fillColor: new Color(255 / 255, 255 / 255, 255 / 255, 0.5),
        strokeColor: new Color(255 / 255, 255 / 255, 255 / 255, 0.75),
        strokeWidth: 1.5,
        };

        strokedWhite =
        {
        strokeColor: new Color(255 / 255, 255 / 255, 255 / 255, 0.75),
        strokeWidth: 1.5,
        };

        solidWhite =
        {
        fillColor: new Color(255 / 255, 255 / 255, 255 / 255, 0.5),
        };


        path = new Path.RegularPolygon(new Point(0, 0), 6, 25 / 2);
        path.style = strokedRed;
        path.closed = true;

        dimensionalPath = new path3D(path);
        dimensionalPath.rotationZ = 90;
        dimensionalPath.translationZ = -250;

        //outer circle
        path = Path.Circle(new Point(0,0), 390 / 2);
        path.style = strokedRed;
        circle_a = new path3D(path);

        var arc = buildDonutArc({x:0, y:0}, 390, 0, 90, 25);
        arc.style = solidRed;
        arc.closed = true;
        arc_a = new path3D(arc);

        //inner circle
        path = new Path.Circle(new Point(0,0), 235 / 2);
        path.style = strokedWhite;
        circle_b = new path3D(path);
        circle_b.translationZ = -250;

        arc = buildDonutArc({x:0, y:0}, 235, -0, 180, 10);
        arc.style = solidWhite;
        arc.closed = true;
        arc_b = new path3D(arc);
        arc_b.translationZ = -250;

        //bar
        path = new Path.Rectangle(new Point(-310 / 2, -38 / 2), new Point(310 / 2, 38 / 2));
        path.style = solidBlueLigth;
        var rect = new path3D(path);
        rect.translationY = 500;
        rect.translationZ = -200;

        //stroke bar
        path = new Path.Rectangle(new Point(-312 / 2, -40 / 2), new Point(312 / 2, 40 / 2));
        path.style = strokedBlue;

        rect = new path3D(path);
        rect.translationY = 498;
        rect.translationZ = -225;

        //percent bar
        path = new Path.Rectangle(new Point(0, -38 / 2), new Point(310, 38 / 2));
        path.style = solidBlue;
        progressBar = new path3D(path);

        progressBar.translationX = -310;
        progressBar.translationY = 500;
        progressBar.translationZ = -250;

        setProgress(0.5);

        path = new Path.Circle(new Point(0,0), 1175 / 2);
        path.style = strokedBlue;
        circle_c = new path3D(path);

        path = new Path.Circle(new Point(0,0), 1500 / 2);
        path.style = strokedBlue;
        circle_d = new path3D(path);

        var svgPathGroup = new paper.Group();
        svgPathGroup.importSVG(document.getElementById('Layer_1'));
        $('#Layer_1').hide();

        var group =  svgPathGroup.children['Layer_1'].children[0].children;

        for(var indexpath = 0 ; indexpath < group.length; indexpath++)
        {
            var path = group[indexpath];

            path.opacity = 1.0;
            path.style = solidStrokedRed;

            new path3D(path);
        }

    }
}

function buildDonutArc(center, diameter, startAngle, endAngle, innerOffset)
{
    var arc = new paper.Path();

    var startPoint = calculateRotation(degree2radian(startAngle), diameter / 2);
    var endPoint = calculateRotation(degree2radian(endAngle), diameter / 2);
    var controlCurvePoint = calculateRotation(degree2radian(endAngle - (startAngle - endAngle) / 2), diameter / 2);

    var startInnerPoint = calculateRotation(degree2radian(endAngle), (diameter - innerOffset) / 2);
    var endInnerPoint = calculateRotation(degree2radian(startAngle), (diameter - innerOffset) / 2);
    var controlCurveInnerPoint = calculateRotation(degree2radian(endAngle - (startAngle - endAngle) / 2), (diameter - innerOffset) / 2);

    arc.moveTo(new paper.Point(center.x + startPoint.x, center.y + startPoint.y));//start point
    arc.arcTo(new paper.Point(center.x + controlCurvePoint.x, center.y + controlCurvePoint.y),//curve controller
              new paper.Point(center.x + endPoint.x, center.y + endPoint.y));//end point

    arc.lineTo(new paper.Point(center.x + startInnerPoint.x, center.y + startInnerPoint.y));//start point
    arc.arcTo(new paper.Point(center.x + controlCurveInnerPoint.x, center.y + controlCurveInnerPoint.y),//curve controller
              new paper.Point(center.x + endInnerPoint.x, center.y + endInnerPoint.y));//end point

    return arc;
}

function updateShapes()
{
    //console.log("_path_3d_List_.length : ", _path_3d_List_.length);

    if(pause)
        return;

    var changed = false;

    //cameraRotation.x -= 1;
    //cameraRotation.y -= 1;//*/

    if(progressBar.scaleX < 1.0)
        progressBar.scaleX += 0.01;
    else
        progressBar.scaleX = 0.1;
    //*/

    dimensionalPath.rotationX -= 1;
    dimensionalPath.rotationY -= 4;
    dimensionalPath.rotationZ -= 8;//*/

    circle_d.rotationX = circle_c.rotationX = circle_b.rotationX = circle_a.rotationX = arc_b.rotationX = arc_a.rotationX = cameraRotation.x * -1;
    circle_d.rotationY = circle_c.rotationY = circle_b.rotationY = circle_a.rotationY = arc_b.rotationY = arc_a.rotationY = cameraRotation.y * -1;

    arc_a.rotationZ -= 4;
    arc_b.rotationZ += 4;//*/

    for(var indexList = 0; indexList < _path_3d_List_.length; indexList++)
    {

        //ROTATE X
        rotationMatrix_x.setRotation(new Array(1, 0, 0, degree2radian(cameraRotation.x)));//to radians

        //ROTATE Y
        rotationMatrix_y.setRotation(new Array(0, 1, 0, degree2radian(cameraRotation.y)));

        //ROTATE Z
        rotationMatrix_z.setRotation(new Array(0, 0, 1, degree2radian(cameraRotation.z)));

        //MULTIPLY ROTATIONS
        rotationMatrix_a.multiply4(rotationMatrix_x, rotationMatrix_y);
        rotationMatrix_b.multiply4(rotationMatrix_a, rotationMatrix_z);//*/


        //TRANSLATE
        translateMatrix.setTranslation(new Array(cameraTranslation.x + _path_3d_List_[indexList].translationX,
                                                 cameraTranslation.y + _path_3d_List_[indexList].translationY,
                                                 cameraTranslation.z + _path_3d_List_[indexList].translationZ));

        //SCALE
        scaleMatrix.setScale(new Array(cameraScale.x + _path_3d_List_[indexList].scaleX,
                                       cameraScale.y + _path_3d_List_[indexList].scaleY,
                                       cameraScale.z + _path_3d_List_[indexList].scaleZ));

        //MULTIPLY TRANSLATION & SCALE
        identityMatrix_a.multiply4(rotationMatrix_b, translateMatrix);
        identityMatrix.multiply4(identityMatrix_a, scaleMatrix);

        //ROTATE X
        rotationMatrix_x.setRotation(new Array(1, 0, 0, degree2radian(_path_3d_List_[indexList].rotationX)));//to radians

        //ROTATE Y
        rotationMatrix_y.setRotation(new Array(0, 1, 0, degree2radian(_path_3d_List_[indexList].rotationY)));

        //ROTATE Z
        rotationMatrix_z.setRotation(new Array(0, 0, 1, degree2radian(_path_3d_List_[indexList].rotationZ)));

        //MULTIPLY ROTATIONS
        rotationMatrix_a.multiply4(rotationMatrix_x, rotationMatrix_y);
        rotationMatrix_b.multiply4(rotationMatrix_a, rotationMatrix_z);

        //MULTIPLY IDENTITY & ROTATIONS, SET TRANSFORMATION MATRIX
        transformationMatrix.multiply4(identityMatrix, rotationMatrix_b);

        _path_3d_List_[indexList].transform();
    }

}

function start()
{
    console.log("tween start");
}

function update()
{
    console.log("tween update");
}

function complete()
{
    console.log("tween complete");
}

//3D TRANSFORM
function transform(segments, path, matrix, translate)
{
    var z = 0.0;

    for(var indexSegments = 0; indexSegments < segments.length; indexSegments++)
    {
        _array3d_transform_[0] = segments[indexSegments].point.x;
        _array3d_transform_[1] = segments[indexSegments].point.y;
        _array3d_transform_[2] = z;

        transformPoint(_pont2d_transform_,//callback
                       _array3d_transform_,
                       matrix,
                       true);

        path.segments[indexSegments].point.x = _pont2d_transform_.x;
        path.segments[indexSegments].point.y = _pont2d_transform_.y;

        if(!segments[indexSegments].handleIn.isZero())
        {
            _array3d_transform_[0] = segments[indexSegments].handleIn.x + segments[indexSegments].point.x;
            _array3d_transform_[1] = segments[indexSegments].handleIn.y + segments[indexSegments].point.y;
            _array3d_transform_[2] = z;

            handleIn = transformPoint(_pont2d_transform_,//callback
                                      _array3d_transform_,
                                      matrix,
                                      false);//*/

            path.segments[indexSegments].handleIn.x = _pont2d_transform_.x - path.segments[indexSegments].point.x;
            path.segments[indexSegments].handleIn.y = _pont2d_transform_.y - path.segments[indexSegments].point.y;

        }

        if(!segments[indexSegments].handleOut.isZero())
        {

            _array3d_transform_[0] = segments[indexSegments].handleOut.x + segments[indexSegments].point.x;
            _array3d_transform_[1] = segments[indexSegments].handleOut.y + segments[indexSegments].point.y;
            _array3d_transform_[2] = z;

            handleOut = transformPoint(_pont2d_transform_,//callback
                                       _array3d_transform_,
                                       matrix,
                                       false);//*/

            path.segments[indexSegments].handleOut.x = _pont2d_transform_.x - path.segments[indexSegments].point.x;
            path.segments[indexSegments].handleOut.y = _pont2d_transform_.y - path.segments[indexSegments].point.y;
        }

        path.segments[indexSegments].point.x += canvasWidth / 2;
        path.segments[indexSegments].point.y += canvasHeigth / 2;

    }
}

function transformPoint(point, pointArray, matrix, translate)
{
    matrix.multiply1(pointArray);
    roundArray(pointArray);
    to2d(point, pointArray, translate);
}

function to2d(point2D, point3Darray, translate)
{
    var scale = kFieldOfView / (point3Darray[2] + kFieldOfView);

    if(translate)
    {
        point2D.x = point3Darray[0] * scale;// + canvasWidth / 2;
        point2D.y = point3Darray[1] * scale;// + canvasHeigth / 2;
    }
    else
    {
        point2D.x = point3Darray[0] * scale;
        point2D.y = point3Darray[1] * scale;
    }
}

function path3D(path)
{
    this.translationX = 0.0;
    this.translationY = 0.0;
    this.translationZ = 0.0;

    this.rotationX = 0.0;
    this.rotationY = 0.0;
    this.rotationZ = 0.0;

    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.scaleZ = 1.0;

    var segments = [];

    for(var indexSegments = 0; indexSegments < path.segments.length; indexSegments++)
    {
        segments[indexSegments] = path.segments[indexSegments].clone();
    }

    this.segments = segments;

    this.shape = path;
    this.changed = true;

    this.transform = function ()
    {
        transform(this.segments, this.shape, transformationMatrix);//pending refresh segments
        this.changed = false;
    }

    _path_3d_List_[_path_3d_List_.length] = this;

    this.updateShape = function(segments)
    {
        this.segments = segments;
        this.changed = true;
    }
}

//MATH
function degree2radian(degree) // returns convert degree to radian
{
    return degree * (Math.PI / 180);
};

function radian2degree(radian) // returns convert radian to degree
{
    return radian * (180 /Math.PI);
};

function calculateRotation(angle, radius)
{
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;

    return {x:x, y:y};
};
