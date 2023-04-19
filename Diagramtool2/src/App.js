import './App.css';
import React, {useState, useRef} from "react";
import useImage from "use-image";
import {
    Stage,
    Layer,
    Image,
    Transformer,
    Rect,
    Ellipse,
    Star,
    Text,
    Arrow
} from "react-konva";

import Toolbar from "./Components/ToolbarShapes.js";
import Connector from "./Components/Connector.jsx";

class TransformerComponent extends React.Component {
    componentDidMount() {
        this.checkNode();
    }

    componentDidUpdate() {
        this.checkNode();
    }

    checkNode() {
        const stage = this.transformer.getStage();

        const {selectedShapeName} = this.props;
        if (selectedShapeName === "") {
            this.transformer.detach();
            return;
        }
        const selectedNode = stage.findOne("." + selectedShapeName);
        if (selectedNode === this.transformer.node()) {
            return;
        }

        if (selectedNode) {
            this.transformer.attachTo(selectedNode);
        } else {
            this.transformer.detach();
        }
        this.transformer.getLayer().batchDraw();
    }

    render() {
        let stuff;
        if (this.props.selectedShapeName.includes("text")) {
            stuff = (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    name="transformer"
                    boundBoxFunc={(oldBox, newBox) => {
                        newBox.width = Math.max(30, newBox.width);
                        return newBox;
                    }}
                    enabledAnchors={["middle-left", "middle-right"]}
                />
            );
        } else if (this.props.selectedShapeName.includes("star")) {
            stuff = (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    name="transformer"
                    enabledAnchors={[
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right"
                    ]}
                />
            );
        } else if (this.props.selectedShapeName.includes("arrow")) {
            stuff = (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    name="transformer"
                    resizeEnabled={false}
                    rotateEnabled={false}
                />
            );
        } else {
            stuff = (
                <Transformer
                    ref={node => {
                        this.transformer = node;
                    }}
                    name="transformer"
                    keepRatio={true}
                />
            );
        }
        return stuff;
    }
}

let history = [];
let historyStep = 0;

//Hauptfunktion
function App(props) {
    const dragUrl = React.useRef();
    const [images, setImages] = React.useState([]);

    //function um Bild in Stage darzustellen, da Konva es nicht normalerweise erlaubt Bilder zu benutzen
    const URLImage = ({image}) => {
        const [img] = useImage(image.src);
        return (
            <Image
                image={img}
                x={image.x}
                y={image.y}
                offsetX={img ? img.width / 2 : 0}
                offsetY={img ? img.height / 2 : 0}
                style={{width: 50, height: 50}}
            />
        );
    };

    const [layerX, setLayerX] = useState(0);
    const [layerY, setLayerY] = useState(0);
    const [layerScale, setLayerScale] = useState(1);
    const [selectedShapeName, setSelectedShapeName] = useState("");
    const [errorMsg, seterrorMsg] = useState("");
    const [man, setMan] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [stars, setStars] = useState([]);
    const [texts, setTexts] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [ellipses, setEllipses] = useState([]);
    const [connectors, setConnectors] = useState([]);
    const [currentTextRef, setCurrentTextRef] = useState("");
    const [shouldTextUpdate, setShouldTextUpdate] = useState(true);
    const [textX, setTextX] = useState(0);
    const [textY, setTextY] = useState(0);
    const [textEditVisible, setTextEditVisible] = useState(false);
    const [arrowDraggable, setArrowDraggable] = useState(false);
    const [newArrowRef, setNewArrowRef] = useState("");
    const [count, setCount] = useState(0);
    const [newArrowDropped, setNewArrowDropped] = useState(false);
    const [newConnectorDropped, setNewConnectorDropped] = useState(false);
    const [arrowEndX, setArrowEndX] = useState(0);
    const [arrowEndY, setArrowEndY] = useState(0);
    const [isTransforming, setIsTransforming] = useState(false);
    const [lastFill, setLastFill] = useState(null);

    const [saving, setSaving] = useState(null);
    const [saved, setSaved] = useState([]);
    const [roadmapId, setRoadmapId] = useState(null);
    const [alreadyCreated, setAlreadyCreated] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [isPasteDisabled, setIsPasteDisabled] = useState(false);
    const [ellipseDeleteCount, setEllipseDeleteCount] = useState(0);
    const [starDeleteCount, setStarDeleteCount] = useState(0);
    const [arrowDeleteCount, setArrowDeleteCount] = useState(0);
    const [textDeleteCount, setTextDeleteCount] = useState(0);
    const [rectDeleteCount, setRectDeleteCount] = useState(0);
    const [state, setState] = useState({});
    const stageRef = useRef(null);
    const layerRef = useRef(null);
    const textRef = useRef(null);
    const graphicRef = useRef(null);
    const graphicStageRef = useRef(null);
    const shapeRef = useRef(null)

    const handleWheel = e => {

        if (
            rectangles.length === 0 &&
            ellipses.length === 0 &&
            stars.length === 0 &&
            texts.length === 0 &&
            arrows.length === 0 &&
            man.length === 0
        ) {
        } else {
            e.preventDefault();
            const scaleBy = 1.2;
            const stage = stageRef.current;
            const layer = layerRef.current;
            const oldScale = layer.scaleX();
            const mousePointTo = {
                x:
                    stage.getPointerPosition().x / oldScale -
                    layerX / oldScale,
                y:
                    stage.getPointerPosition().y / oldScale - layerY / oldScale
            };

            const newScale =
                e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

            layer.scale({x: newScale, y: newScale});

            setState({
                layerScale: newScale,
                layerX:
                    -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
                    newScale,
                layerY:
                    -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
            });
        }
    }

    const handleStageClick = (e) => {
        const stage = e.target;
        const pos = stage.getPointerPosition();
        const shape = stage.getIntersection(pos);
        if (
            shape !== null &&
            shape.name() !== undefined &&
            shape.name() !== undefined
        ) {
            setState(
                {
                    selectedShapeName: shape.name()
                },
                () => {
                    graphicRef.draw();
                }
            );
        }

        //arrow logic
        if (state.newArrowRef !== "") {
            if (state.previousShape) {
                if (state.previousShape.attrs.id !== "ContainerRect") {

                    arrows.map(eachArrow => {
                        if (eachArrow.name === state.newArrowRef) {
                            eachArrow.to = state.previousShape;
                        }
                    });
                }
            }

            //handle connector
            arrows.map(eachArrow => {
                if (eachArrow.name === state.newArrowRef) {
                    eachArrow.fill = "black";
                    eachArrow.stroke = "black";
                }
            });
            //arrow logic
            setState({
                arrowDraggable: false,
                newArrowRef: ""
            });
        }
    };

    const handleMouseOver = (e) => {
        //get the currennt arrow ref and modify its position by filtering & pushing again
        //console.log("lastFill: ", state.lastFill);
        const stage = e.target.getStage();
        let pos = e.getPointerPosition;
        const shape = stage.getIntersection(pos);

        if (shape && shape.attrs.link) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }

        //if we are moving an arrow
        if (newArrowRef !== "") {

            const transform = layerRef.current.layer2.getAbsoluteTransform().copy();
            transform.invert();

            pos = transform.point(pos);
            setState({arrowEndX: pos.x, arrowEndY: pos.y});
            //last non arrow object
            if (shape && shape.attrs && shape.attrs.name !== undefined) {
                //  console.log(shape);
                if (!shape.attrs.name.includes("arrow")) {
                    //after first frame
                    if (state.previousShape)
                        if (state.previousShape !== shape) {
                            //arrow entered a new shape

                            if (state.previousShape.attrs.id !== "ContainerRect") {
                                arrows.map(eachArrow => {
                                    if (eachArrow.name === state.newArrowRef) {
                                        eachArrow.fill = "black";
                                        eachArrow.stroke = "black";
                                    }
                                });
                                setState({});
                            } else {
                                arrows.map(eachArrow => {
                                    if (eachArrow.name === state.newArrowRef) {
                                        eachArrow.fill = "#ccf5ff";
                                        eachArrow.stroke = "#ccf5ff";
                                    }
                                });
                                setState({});
                            }
                        }
                    //if arrow is moving in a single shape
                }

                if (!shape.attrs.name.includes("arrow")) {
                    setState({previousShape: shape});
                }
            }
        }
        var arrows = arrows;

        arrows.map(eachArrow => {
            if (eachArrow.name === state.newArrowRef) {
                var index = arrows.indexOf(eachArrow);
                let currentArrow = eachArrow;
                currentArrow.points = [
                    currentArrow.points[0],
                    currentArrow.points[1],
                    pos.x,
                    pos.y
                ];

                arrows[index] = currentArrow;
            }
        });
    };

    const componentDidUpdate = (prevProps, prevState) => {
        let prevMainShapes = [
            prevState.rectangles,
            prevState.ellipses,
            prevState.stars,
            prevState.arrows,
            prevState.connectors,
            prevState.texts
        ];
        let currentMainShapes = [
            rectangles,
            ellipses,
            stars,
            arrows,
            connectors,
            texts,
            man
        ];

        if (!state.redoing && !state.isTransforming)
            if (JSON.stringify(state) !== JSON.stringify(prevState)) {
                if (
                    JSON.stringify(prevMainShapes) !== JSON.stringify(currentMainShapes)
                ) {
                    if (state.shouldTextUpdate) {
                        var uh = history;
                        history = uh.slice(0, historyStep + 1);
                        //console.log("sliced", history);
                        var toAppend = state;
                        history = history.concat(toAppend);
                        //console.log("new", history);
                        historyStep += 1;
                        //console.log(history, historyStep, history[historyStep]);
                    }
                }
            } else {
                console.log("compoenntDidUpdate but attrs didn't change");
            }
        state.redoing = false;
    }

    const handleUndo = () => {
        if (!state.isTransforming) {
            if (!state.textEditVisible) {
                if (historyStep === 0) {
                    return;
                }
                historyStep -= 1;

                setState(
                    {
                        rectangles: history[historyStep].rectangles,
                        arrows: history[historyStep].arrows,
                        ellipses: history[historyStep].ellipses,
                        stars: history[historyStep].stars,
                        texts: history[historyStep].texts,
                        connectors: history[historyStep].connectors,
                        redoing: true,
                        selectedShapeName: shapeIsGone(history[historyStep])
                            ? ""
                            : selectedShapeName
                    },
                    (e) => {
                        e.graphicStage.draw();
                    }
                );
            }
        }
    };

    const handleRedo = () => {
        if (historyStep === history.length - 1) {
            return;
        }
        historyStep += 1;
        const next = history[historyStep];
        setState(
            {
                rectangles: next.rectangles,
                arrows: next.arrows,
                ellipses: next.ellipses,
                stars: next.stars,
                texts: next.texts,
                redoing: true,
                selectedShapeName: shapeIsGone(history[historyStep])
                    ? ""
                    : selectedShapeName
            },
            () => {
                setState({});
            }
        );
    };

    const shapeIsGone = returnTo => {
        var toReturn = true;
        let currentShapeName = selectedShapeName;
        let [rectangles, ellipses, stars, arrows, texts] = [
            returnTo.rectangles,
            returnTo.ellipses,
            returnTo.stars,
            returnTo.arrows,

            returnTo.texts
        ];
        rectangles.map(eachRect => {
            if (eachRect.name === currentShapeName) {
                toReturn = false;
            }
        });
        ellipses.map(eachEllipse => {
            if (eachEllipse.name === currentShapeName) {
                toReturn = false;
            }
        });
        stars.map(eachStar => {
            if (eachStar.name === currentShapeName) {
                toReturn = false;
            }
        });
        arrows.map(eachArrow => {
            if (eachArrow.name === currentShapeName) {
                toReturn = false;
            }
        });

        texts.map(eachText => {
            if (eachText.name === currentShapeName) {
                toReturn = false;
            }
        });

        man.map(eachMan=> {
            if (eachMan.name === currentShapeName) {
                toReturn = false;
            }
        });

        return toReturn;
    };

    const IsJsonString = str => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    const componentDidMount = () => {
        history.push(state);
        setState({selectedShapeName: ""});
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 100, 100);

    //sad attempt at color implementation
    gradient.addColorStop(0.0, "red");
    gradient.addColorStop(1 / 6, "orange");
    gradient.addColorStop(2 / 6, "yellow");
    gradient.addColorStop(3 / 6, "green");
    gradient.addColorStop(4 / 6, "aqua");
    gradient.addColorStop(5 / 6, "blue");
    gradient.addColorStop(1.0, "purple");

    const errMsg = state.errMsg;
    let errDisplay;
    if (errMsg !== "") {
        errDisplay = (
            <div className="errMsginner">
          <span style={{color: "white"}}>
            {errMsg !== "" ? errMsg : null}
          </span>
            </div>
        );
    } else {
    }

    return (
        //Thumbnail Bild Strichmännchen erstellen
        <div>
            <img
                alt="man"
                src="https://static.thenounproject.com/png/12037-200.png"
                style={{width: 65, height: 65}}
                draggable="true"
                onDragStart={(e) => {
                    dragUrl.current = e.target.src;
                }}
            />

            <div
                onDrop={(e) => {
                    e.preventDefault();
                    // register event position
                    e.setPointersPositions(e);
                    // add image
                    setImages(
                        images.concat([
                            {
                                ...e.getPointerPosition(),
                                src: dragUrl.current,
                            },
                        ])
                    );
                }}
                onDragOver={(e) => e.preventDefault()}
            >

                <div
                    onKeyDown={event => {
                        const x = 88,
                            deleteKey = 46,
                            copy = 67,
                            paste = 86,
                            z = 90,
                            y = 89;

                        if (
                            ((event.ctrlKey && event.keyCode === x) ||
                                event.keyCode === deleteKey) &&
                            !state.isPasteDisabled
                        ) {
                            if (selectedShapeName !== "") {
                                var that = that;
                                //delete it from the state too
                                let name = selectedShapeName;
                                var rects = rectangles.filter(function (eachRect) {
                                    if (eachRect.name === name) {
                                        that.setState({
                                            rectDeleteCount: that.state.rectDeleteCount + 1
                                        });
                                    }
                                    return eachRect.name !== name;
                                });

                                var ellipses = ellipses.filter(function (eachRect) {
                                    if (eachRect.name === name) {
                                        that.setState({
                                            ellipseDeleteCount: that.state.ellipseDeleteCount + 1
                                        });
                                    }
                                    return eachRect.name !== name;
                                });

                                var stars = stars.filter(function (eachRect) {
                                    if (eachRect.name === name) {
                                        that.setState({
                                            starDeleteCount: that.state.starDeleteCount + 1
                                        });
                                    }
                                    return eachRect.name !== name;
                                });

                                var arrows = arrows.filter(function (eachRect) {
                                    if (eachRect.name === name) {
                                        that.setState({
                                            arrowDeleteCount: that.state.arrowDeleteCount + 1
                                        });
                                    }
                                    return eachRect.name !== name;
                                });

                                var texts = texts.filter(function (eachRect) {
                                    if (eachRect.name === name) {
                                        that.setState({
                                            textDeleteCount: that.state.textDeleteCount + 1
                                        });
                                    }
                                    return eachRect.name !== name;
                                });

                                setState({
                                    rectangles: rects,
                                    ellipses: ellipses,
                                    stars: stars,
                                    arrows: arrows,
                                    texts: texts,
                                    selectedShapeName: ""
                                });
                            }
                        } else if (event.shiftKey && event.ctrlKey && event.keyCode === z) {
                            handleRedo();
                        } else if (event.ctrlKey && event.keyCode === z) {
                            handleUndo();
                        } else if (event.ctrlKey && event.keyCode === y) {
                            handleRedo();
                        } else if (event.ctrlKey && event.keyCode === copy) {
                            if (selectedShapeName !== "") {
                                //find it
                                let name = selectedShapeName;
                                let copiedElement = null;
                                if (name.includes("rect")) {
                                    copiedElement = rectangles.filter(function (
                                        eachRect
                                    ) {
                                        return eachRect.name === name;
                                    });
                                } else if (name.includes("ellipse")) {
                                    copiedElement = ellipses.filter(function (
                                        eachRect
                                    ) {
                                        return eachRect.name === name;
                                    });
                                } else if (name.includes("star")) {
                                    copiedElement = stars.filter(function (eachRect) {
                                        return eachRect.name === name;
                                    });
                                } else if (name.includes("text")) {
                                    copiedElement = texts.filter(function (eachRect) {
                                        return eachRect.name === name;
                                    });
                                } else if (name.includes("arrow")) {
                                    copiedElement = arrows.filter(function (eachRect) {
                                        return eachRect.name === name;
                                    });
                                }

                                setState({copiedElement: copiedElement}, () => {
                                    console.log("copied ele", state.copiedElement);
                                });
                            }
                        } else if (
                            event.ctrlKey &&
                            event.keyCode === paste &&
                            !state.isPasteDisabled
                        ) {
                            let copiedElement = state.copiedElement[0];
                            console.log(copiedElement);
                            if (copiedElement) {
                                if (copiedElement.attrs) {
                                } else {
                                    if (copiedElement.name.includes("rectangle")) {
                                        var toPush = {
                                            x: copiedElement.x + 10,
                                            y: copiedElement.y + 10,
                                            width: copiedElement.width,
                                            height: copiedElement.height,
                                            stroke: copiedElement.stroke,
                                            strokeWidth: copiedElement.strokeWidth,
                                            name:
                                                "rectangle" +
                                                (rectangles.length +
                                                    state.rectDeleteCount +
                                                    1),
                                            ref:
                                                "rectangle" +
                                                (rectangles.length +
                                                    state.rectDeleteCount +
                                                    1),
                                            fill: copiedElement.fill,
                                            useImage: copiedElement.useImage,
                                            link: copiedElement.link,
                                            rotation: copiedElement.rotation
                                        };
                                        setState(
                                            prevState => ({
                                                rectangles: [...prevState.rectangles, toPush]
                                            }),
                                            () => {
                                                setState({
                                                    selectedShapeName:
                                                        "rectangle" + rectangles.length
                                                });
                                            }
                                        );
                                    } else if (copiedElement.name.includes("arrow")) {

                                        if (copiedElement.to || copiedElement.from) {
                                            setState(
                                                {
                                                    errMsg: "Connectors cannot be pasted"
                                                },
                                                () => {
                                                    var that = that;
                                                    setTimeout(function () {
                                                        that.setState({
                                                            errMsg: ""
                                                        });
                                                    }, 1000);
                                                }
                                            );
                                        } else {
                                            toPush = {
                                                points: [
                                                    copiedElement.points[0] + 30,
                                                    copiedElement.points[1] + 30,
                                                    copiedElement.points[2] + 30,
                                                    copiedElement.points[3] + 30
                                                ],
                                                fill: copiedElement.fill,
                                                link: copiedElement.link,
                                                stroke: copiedElement.stroke,
                                                strokeWidth: copiedElement.strokeWidth,
                                                name:
                                                    "arrow" +
                                                    (arrows.length +
                                                        1 +
                                                        state.arrowDeleteCount),
                                                ref:
                                                    "arrow" +
                                                    (arrows.length +
                                                        1 +
                                                        state.arrowDeleteCount),
                                                rotation: copiedElement.rotation
                                            };
                                            setState(
                                                prevState => ({
                                                    arrows: [...prevState.arrows, toPush]
                                                }),
                                                () => {
                                                    setState({
                                                        selectedShapeName:
                                                            "arrow" + arrows.length
                                                    });
                                                }
                                            );
                                        }
                                    } else if (copiedElement.name.includes("ellipse")) {
                                        toPush = {
                                            x: copiedElement.x + 10,
                                            y: copiedElement.y + 10,
                                            radiusX: copiedElement.radiusX,
                                            radiusY: copiedElement.radiusY,
                                            stroke: copiedElement.stroke,
                                            strokeWidth: copiedElement.strokeWidth,
                                            name:
                                                "ellipse" +
                                                (ellipses.length +
                                                    1 +
                                                    ellipseDeleteCount),
                                            ref:
                                                "ellipse" +
                                                (ellipses.length +
                                                    1 +
                                                    state.ellipseDeleteCount),
                                            fill: copiedElement.fill,
                                            link: copiedElement.link,
                                            useImage: copiedElement.useImage,
                                            rotation: copiedElement.rotation
                                        };
                                        setState(
                                            prevState => ({
                                                ellipses: [...prevState.ellipses, toPush]
                                            }),
                                            () => {
                                                setState({
                                                    selectedShapeName:
                                                        "ellipse" + ellipses.length
                                                });
                                            }
                                        );
                                    } else if (copiedElement.name.includes("star")) {
                                        toPush = {
                                            x: copiedElement.x + 10,
                                            y: copiedElement.y + 10,
                                            link: copiedElement.link,
                                            innerRadius: copiedElement.innerRadius,
                                            outerRadius: copiedElement.outerRadius,
                                            stroke: copiedElement.stroke,
                                            strokeWidth: copiedElement.strokeWidth,
                                            name:
                                                "star" +
                                                (stars.length +
                                                    1 +
                                                    state.starDeleteCount),
                                            ref:
                                                "star" +
                                                (stars.length +
                                                    1 +
                                                    state.starDeleteCount),
                                            fill: copiedElement.fill,
                                            useImage: copiedElement.useImage,
                                            rotation: copiedElement.rotation
                                        };
                                        setState(
                                            prevState => ({
                                                stars: [...prevState.stars, toPush]
                                            }),
                                            () => {
                                                setState({
                                                    selectedShapeName: "star" + stars.length
                                                });
                                            }
                                        );
                                    } else if (copiedElement.name.includes("text")) {
                                        toPush = {
                                            x: copiedElement.x + 10,
                                            y: copiedElement.y + 10,
                                            link: copiedElement.link,

                                            name:
                                                "text" +
                                                (texts.length +
                                                    1 +
                                                    state.textDeleteCount),
                                            ref:
                                                "text" +
                                                (texts.length +
                                                    1 +
                                                    state.textDeleteCount),
                                            fill: copiedElement.fill,
                                            fontSize: copiedElement.fontSize,
                                            fontFamily: copiedElement.fontFamily,
                                            useImage: copiedElement.useImage,
                                            text: copiedElement.text,
                                            width: copiedElement.width,
                                            rotation: copiedElement.rotation
                                        };
                                        setState(
                                            prevState => ({
                                                texts: [...prevState.texts, toPush]
                                            }),
                                            () => {
                                                setState(
                                                    {
                                                        selectedShapeName:
                                                            "text" +
                                                            (texts.length +
                                                                state.textDeleteCount)
                                                    },
                                                    () => {
                                                        console.log(selectedShapeName);
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    }}
                    tabIndex="0"
                    style={{outline: "none"}}
                >
                    <Stage
                        onClick={handleStageClick}
                        onMouseMove={handleMouseOver()}
                        onWheel={event => handleWheel(event)}
                        height={window.innerHeight}
                        width={window.innerWidth}
                        ref={graphicStageRef}
                    >
                        <Layer
                            scaleX={state.layerScale}
                            scaleY={state.layerScale}
                            x={state.layerX}
                            y={state.layerY}
                            height={window.innerHeight}
                            width={window.innerWidth}
                            draggable
                            onDragEnd={() => {
                                setState({
                                    layerX: layerX.layer2.x(),
                                    layerY: layerY.layer2.y()
                                });
                            }}
                            ref={layerRef}
                        >
                            <Rect
                                x={-5 * window.innerWidth}
                                y={-5 * window.innerHeight}
                                height={window.innerHeight * 10}
                                width={window.innerWidth * 10}
                                name=""
                                id="ContainerRect"
                            />

                            {rectangles.map(eachRect => {
                                return (
                                    <Rect
                                        onClick={() => {
                                            var that = that;
                                            if (eachRect.link !== undefined && eachRect.link !== "") {
                                                setState(
                                                    {
                                                        errMsg: "Links will not be opened in create mode"
                                                    },
                                                    () => {
                                                        setTimeout(function () {
                                                            that.setState({
                                                                errMsg: ""
                                                            });
                                                        }, 1000);
                                                    }
                                                );
                                            }
                                        }}
                                        onTransformStart={() => {
                                            setState({
                                                isTransforming: true
                                            });
                                            let rect = rectangles[eachRect.ref];
                                            rect.setAttr("lastRotation", rect.rotation());
                                        }}
                                        onTransform={() => {
                                            let rect = rectangles[eachRect.ref];

                                            if (rect.attrs.lastRotation !== rect.rotation()) {
                                                arrows.map(eachArrow => {
                                                    if (
                                                        eachArrow.to &&
                                                        eachArrow.to.name() === rect.name()
                                                    ) {
                                                        setState({
                                                            errMsg:
                                                                "Rotating rects with connectors might skew things up!"
                                                        });
                                                    }
                                                    if (
                                                        eachArrow.from &&
                                                        eachArrow.from.name() === rect.name()
                                                    ) {
                                                        setState({
                                                            errMsg:
                                                                "Rotating rects with connectors might skew things up!"
                                                        });
                                                    }
                                                });
                                            }

                                            rect.setAttr("lastRotation", rect.rotation());
                                        }}
                                        onTransformEnd={() => {
                                            setState({
                                                isTransforming: false
                                            });
                                            let rect = rectangles[eachRect.ref];
                                            setState(
                                                prevState => ({
                                                    errMsg: "",
                                                    rectangles: prevState.rectangles.map(eachRect =>
                                                        eachRect.name === rect.attrs.name
                                                            ? {
                                                                ...eachRect,
                                                                width: rect.width() * rect.scaleX(),
                                                                height: rect.height() * rect.scaleY(),
                                                                rotation: rect.rotation(),
                                                                x: rect.x(),
                                                                y: rect.y()
                                                            }
                                                            : eachRect
                                                    )
                                                }),
                                                () => {
                                                    setState({})
                                                }
                                            );

                                            rect.setAttr("scaleX", 1);
                                            rect.setAttr("scaleY", 1);
                                        }}
                                        rotation={eachRect.rotation}
                                        ref={eachRect.ref}
                                        fill={eachRect.fill}
                                        name={eachRect.name}
                                        x={eachRect.x}
                                        y={eachRect.y}
                                        width={eachRect.width}
                                        height={eachRect.height}
                                        stroke={eachRect.stroke}
                                        strokeWidth={eachRect.strokeWidth}
                                        strokeScaleEnabled={false}
                                        draggable
                                        onDragMove={() => {
                                            arrows.map(eachArrow => {
                                                if (eachArrow.from !== undefined) {
                                                    if (eachRect.name === eachArrow.from.attrs.name) {
                                                        eachArrow.points = [
                                                            eachRect.x,
                                                            eachRect.y,
                                                            eachArrow.points[2],
                                                            eachArrow.points[3]
                                                        ];
                                                        setState({})
                                                    }
                                                }

                                                if (eachArrow.to !== undefined) {
                                                    if (eachRect.name === eachArrow.to.attrs.name) {
                                                        eachArrow.points = [
                                                            eachArrow.points[0],
                                                            eachArrow.points[1],
                                                            eachRect.x,
                                                            eachRect.y
                                                        ];
                                                        setState({})
                                                    }
                                                }
                                            });
                                        }}
                                        onDragEnd={event => {
                                            var shape = shapeRef[eachRect.ref];

                                            setState(prevState => ({
                                                rectangles: prevState.rectangles.map(eachRect =>
                                                    eachRect.name === shape.attrs.name
                                                        ? {
                                                            ...eachRect,
                                                            x: event.target.x(),
                                                            y: event.target.y()
                                                        }
                                                        : eachRect
                                                )
                                            }));
                                        }}
                                    />
                                );
                            })}
                            {ellipses.map(eachEllipse => (
                                <Ellipse
                                    ref={eachEllipse.ref}
                                    name={eachEllipse.name}
                                    x={eachEllipse.x}
                                    y={eachEllipse.y}
                                    rotation={eachEllipse.rotation}
                                    radiusX={eachEllipse.radiusX}
                                    radiusY={eachEllipse.radiusY}
                                    fill={eachEllipse.fill}
                                    stroke={eachEllipse.stroke}
                                    strokeWidth={eachEllipse.strokeWidth}
                                    strokeScaleEnabled={false}
                                    onClick={() => {
                                        var that = that;
                                        if (
                                            eachEllipse.link !== undefined &&
                                            eachEllipse.link !== ""
                                        ) {
                                            setState(
                                                {
                                                    errMsg: "Links will not be opened in create mode"
                                                },
                                                () => {
                                                    setTimeout(function () {
                                                        that.setState({
                                                            errMsg: ""
                                                        });
                                                    }, 1000);
                                                }
                                            );
                                        }
                                    }}
                                    onTransformStart={() => {
                                        setState({isTransforming: true});
                                        let ellipse = ellipses[eachEllipse.ref];
                                        ellipse.setAttr("lastRotation", ellipse.rotation());
                                    }}
                                    onTransform={() => {
                                        let ellipse = ellipses[eachEllipse.ref];

                                        if (ellipse.attrs.lastRotation !== ellipse.rotation()) {
                                            arrows.map(eachArrow => {
                                                if (
                                                    eachArrow.to &&
                                                    eachArrow.to.name() === ellipse.name()
                                                ) {
                                                    setState({
                                                        errMsg:
                                                            "Rotating ellipses with connectors might skew things up!"
                                                    });
                                                }
                                                if (
                                                    eachArrow.from &&
                                                    eachArrow.from.name() === ellipse.name()
                                                ) {
                                                    setState({
                                                        errMsg:
                                                            "Rotating ellipses with connectors might skew things up!"
                                                    });
                                                }
                                            });
                                        }

                                        ellipse.setAttr("lastRotation", ellipse.rotation());
                                    }}
                                    onTransformEnd={() => {
                                        setState({isTransforming: false});
                                        let ellipse = ellipses[eachEllipse.ref];
                                        ellipse.scaleX();
                                        ellipse.scaleY();
                                        setState(prevState => ({
                                            errMsg: "",
                                            ellipses: prevState.ellipses.map(eachEllipse =>
                                                eachEllipse.name === ellipse.attrs.name
                                                    ? {
                                                        ...eachEllipse,

                                                        radiusX: ellipse.radiusX() * ellipse.scaleX(),
                                                        radiusY: ellipse.radiusY() * ellipse.scaleY(),
                                                        rotation: ellipse.rotation(),
                                                        x: ellipse.x(),
                                                        y: ellipse.y()
                                                    }
                                                    : eachEllipse
                                            )
                                        }));

                                        ellipse.setAttr("scaleX", 1);
                                        ellipse.setAttr("scaleY", 1);
                                        setState({})
                                    }}
                                    draggable
                                    onDragMove={() => {
                                        console.log(
                                            "name of ellipse moving: ",
                                            eachEllipse.name,
                                            "new x y",
                                            eachEllipse.x,
                                            eachEllipse.y
                                        );
                                        arrows.map(eachArrow => {
                                            if (eachArrow.from !== undefined) {
                                                console.log("prevArrow: ", eachArrow.points);
                                                if (eachEllipse.name === eachArrow.from.attrs.name) {
                                                    eachArrow.points = [
                                                        eachEllipse.x,
                                                        eachEllipse.y,
                                                        eachArrow.points[2],
                                                        eachArrow.points[3]
                                                    ];
                                                    setState({})
                                                    arrows.graphicStage.draw();
                                                }
                                                console.log("new arrows:", eachArrow.points);
                                            }

                                            if (eachArrow.to !== undefined) {
                                                if (eachEllipse.name === eachArrow.to.attrs.name) {
                                                    eachArrow.points = [
                                                        eachArrow.points[0],
                                                        eachArrow.points[1],
                                                        eachEllipse.x,
                                                        eachEllipse.y
                                                    ];
                                                    setState({})
                                                    ellipses.graphicStage.draw();
                                                }
                                            }
                                        });
                                    }}
                                    onDragEnd={event => {
                                        var shape = ellipses[eachEllipse.ref];
                                        setState(prevState => ({
                                            ellipses: prevState.ellipses.map(eachEllipse =>
                                                eachEllipse.name === shape.attrs.name
                                                    ? {
                                                        ...eachEllipse,
                                                        x: event.target.x(),
                                                        y: event.target.y()
                                                    }
                                                    : eachEllipse
                                            )
                                        }));

                                        ellipses.graphicStage.draw();
                                    }}
                                />
                            ))}
                            {stars.map(eachStar => (
                                <Star
                                    ref={eachStar.ref}
                                    name={eachStar.name}
                                    x={eachStar.x}
                                    y={eachStar.y}
                                    innerRadius={eachStar.innerRadius}
                                    outerRadius={eachStar.outerRadius}
                                    numPoints={eachStar.numPoints}
                                    stroke={eachStar.stroke}
                                    strokeWidth={eachStar.strokeWidth}
                                    fill={eachStar.fill}
                                    strokeScaleEnabled={false}
                                    rotation={eachStar.rotation}
                                    onClick={() => {
                                        var that = that;
                                        if (eachStar.link !== undefined && eachStar.link !== "") {
                                            setState(
                                                {
                                                    errMsg: "Links will not be opened in create mode"
                                                },
                                                () => {
                                                    setTimeout(function () {
                                                        that.setState({
                                                            errMsg: ""
                                                        });
                                                    }, 1000);
                                                }
                                            );
                                        }
                                    }}
                                    onTransformStart={() => {
                                        setState({isTransforming: true});
                                    }}
                                    onTransformEnd={() => {
                                        setState({isTransforming: false});
                                        let star = star[eachStar.ref];
                                        star.scaleX();
                                        star.scaleY();
                                        setState(prevState => ({
                                            stars: prevState.stars.map(eachStar =>
                                                eachStar.name === star.attrs.name
                                                    ? {
                                                        ...eachStar,
                                                        innerRadius: star.innerRadius() * star.scaleX(),
                                                        outerRadius: star.outerRadius() * star.scaleX(),
                                                        rotation: star.rotation(),
                                                        x: star.x(),
                                                        y: star.y()
                                                    }
                                                    : eachStar
                                            )
                                        }));
                                        star.setAttr("scaleX", 1);
                                        star.setAttr("scaleY", 1);
                                        setState({})
                                    }}
                                    draggable
                                    onDragMove={() => {
                                        arrows.map(eachArrow => {
                                            if (eachArrow.from !== undefined) {
                                                if (eachStar.name === eachArrow.from.attrs.name) {
                                                    eachArrow.points = [
                                                        eachStar.x,
                                                        eachStar.y,
                                                        eachArrow.points[2],
                                                        eachArrow.points[3]
                                                    ];
                                                    setState({})
                                                }
                                            }

                                            if (eachArrow.to !== undefined) {
                                                if (eachStar.name === eachArrow.to.attrs.name) {
                                                    eachArrow.points = [
                                                        eachArrow.points[0],
                                                        eachArrow.points[1],
                                                        eachStar.x,
                                                        eachStar.y
                                                    ];
                                                    setState({})
                                                }
                                            }
                                        });
                                    }}
                                    onDragEnd={event => {
                                        var shape = stars[eachStar.ref];

                                        setState(prevState => ({
                                            stars: prevState.stars.map(eachStar =>
                                                eachStar.name === shape.attrs.name
                                                    ? {
                                                        ...eachStar,
                                                        x: event.target.x(),
                                                        y: event.target.y()
                                                    }
                                                    : eachStar
                                            )
                                        }));
                                    }}
                                />
                            ))}
                            {texts.map(eachText => (
                                <Text
                                    textDecoration={eachText.link ? "underline" : ""}
                                    onTransformStart={() => {
                                        var currentText = texts[selectedShapeName];
                                        currentText.setAttr("lastRotation", currentText.rotation());
                                    }}
                                    onTransform={() => {
                                        var currentText = texts[selectedShapeName];

                                        currentText.setAttr(
                                            "width",
                                            currentText.width() * currentText.scaleX()
                                        );
                                        currentText.setAttr("scaleX", 1);

                                        currentText.draw();

                                        if (
                                            currentText.attrs.lastRotation !== currentText.rotation()
                                        ) {
                                            arrows.map(eachArrow => {
                                                if (
                                                    eachArrow.to &&
                                                    eachArrow.to.name() === currentText.name()
                                                ) {
                                                    setState({
                                                        errMsg:
                                                            "Rotating texts with connectors might skew things up!"
                                                    });
                                                }
                                                if (
                                                    eachArrow.from &&
                                                    eachArrow.from.name() === currentText.name()
                                                ) {
                                                    setState({
                                                        errMsg:
                                                            "Rotating texts with connectors might skew things up!"
                                                    });
                                                }
                                            });
                                        }

                                        currentText.setAttr("lastRotation", currentText.rotation());
                                    }}
                                    onTransformEnd={() => {
                                        var currentText = texts[selectedShapeName];

                                        setState(prevState => ({
                                            errMsg: "",
                                            texts: prevState.texts.map(eachText =>
                                                eachText.name === selectedShapeName
                                                    ? {
                                                        ...eachText,
                                                        width: currentText.width(),
                                                        rotation: currentText.rotation(),
                                                        textWidth: currentText.textWidth,
                                                        textHeight: currentText.textHeight,
                                                        x: currentText.x(),
                                                        y: currentText.y()
                                                    }
                                                    : eachText
                                            )
                                        }));
                                        currentText.setAttr("scaleX", 1);
                                        currentText.draw();
                                    }}
                                    link={eachText.link}
                                    width={eachText.width}
                                    fill={eachText.fill}
                                    name={eachText.name}
                                    ref={eachText.ref}
                                    rotation={eachText.rotation}
                                    fontFamily={eachText.fontFamily}
                                    fontSize={eachText.fontSize}
                                    x={eachText.x}
                                    y={eachText.y}
                                    text={eachText.text}
                                    draggable
                                    onDragMove={() => {
                                        arrows.map(eachArrow => {
                                            if (eachArrow.from !== undefined) {
                                                if (eachText.name === eachArrow.from.attrs.name) {
                                                    eachArrow.points = [
                                                        eachText.x,
                                                        eachText.y,
                                                        eachArrow.points[2],
                                                        eachArrow.points[3]
                                                    ];
                                                    setState({})
                                                }
                                            }

                                            if (eachArrow.to !== undefined) {
                                                if (eachText.name === eachArrow.to.attrs.name) {
                                                    eachArrow.points = [
                                                        eachArrow.points[0],
                                                        eachArrow.points[1],
                                                        eachText.x,
                                                        eachText.y
                                                    ];
                                                    setState({})
                                                }
                                            }
                                        });
                                    }}
                                    onDragEnd={event => {
                                        var shape = arrows[eachText.ref];

                                        setState(prevState => ({
                                            texts: prevState.texts.map(eachtext =>
                                                eachtext.name === shape.attrs.name
                                                    ? {
                                                        ...eachtext,
                                                        x: event.target.x(),
                                                        y: event.target.y()
                                                    }
                                                    : eachtext
                                            )
                                        }));
                                    }}
                                    onClick={() => {
                                        var that = that;
                                        if (eachText.link !== undefined && eachText.link !== "") {
                                            setState(
                                                {
                                                    errMsg: "Links will not be opened in create mode"
                                                },
                                                () => {
                                                    setTimeout(function () {
                                                        that.setState({
                                                            errMsg: ""
                                                        });
                                                    }, 1000);
                                                }
                                            );
                                        }
                                    }}
                                    onDblClick={() => {
                                        // turn into textarea
                                        var stage = stageRef.graphicStage;
                                        var text = stage.findOne("." + eachText.name);

                                        setState({
                                            textX: text.absolutePosition().x,
                                            textY: text.absolutePosition().y,
                                            textEditVisible: !state.textEditVisible,
                                            text: eachText.text,
                                            textNode: eachText,
                                            currentTextRef: eachText.ref,
                                            textareaWidth: text.textWidth,
                                            textareaHeight: text.textHeight,
                                            textareaFill: text.attrs.fill,
                                            textareaFontFamily: text.attrs.fontFamily,
                                            textareaFontSize: text.attrs.fontSize
                                        });
                                        let textarea = text.textarea;
                                        textarea.focus();
                                        text.hide();
                                        var transformer = stage.findOne(".transformer");
                                        transformer.hide();
                                        layerRef.layer2.draw();
                                    }}
                                />
                            ))}
                            {arrows.map(eachArrow => {
                                if (!eachArrow.from && !eachArrow.to) {
                                    return (
                                        <Arrow
                                            ref={eachArrow.ref}
                                            name={eachArrow.name}
                                            points={[
                                                eachArrow.points[0],
                                                eachArrow.points[1],
                                                eachArrow.points[2],
                                                eachArrow.points[3]
                                            ]}
                                            stroke={eachArrow.stroke}
                                            fill={eachArrow.fill}
                                            draggable
                                            onDragEnd={() => {

                                                let oldPoints = [
                                                    eachArrow.points[0],
                                                    eachArrow.points[1],
                                                    eachArrow.points[2],
                                                    eachArrow.points[3]
                                                ];

                                                let shiftX = shiftX[eachArrow.ref].attrs.x;
                                                let shiftY = shiftY[eachArrow.ref].attrs.y;

                                                let newPoints = [
                                                    oldPoints[0] + shiftX,
                                                    oldPoints[1] + shiftY,
                                                    oldPoints[2] + shiftX,
                                                    oldPoints[3] + shiftY
                                                ];

                                                eachArrow[eachArrow.ref].position({x: 0, y: 0});
                                                layerRef.layer2.draw();

                                                setState(prevState => ({
                                                    arrows: prevState.arrows.map(eachArr =>
                                                        eachArr.name === eachArrow.name
                                                            ? {
                                                                ...eachArr,
                                                                points: newPoints
                                                            }
                                                            : eachArr
                                                    )
                                                }));
                                            }}
                                        />
                                    );
                                } else if (
                                    eachArrow.name === state.newArrowRef &&
                                    (eachArrow.from || eachArrow.to)
                                ) {
                                    return (
                                        <Connector
                                            name={eachArrow.name}
                                            from={eachArrow.from}
                                            to={eachArrow.to}
                                            arrowEndX={state.arrowEndX}
                                            arrowEndY={state.arrowEndY}
                                            current={true}
                                            stroke={eachArrow.stroke}
                                            fill={eachArrow.fill}
                                        />
                                    );
                                } else if (eachArrow.from || eachArrow.to) {
                                    return (
                                        <Connector
                                            name={eachArrow.name}
                                            from={eachArrow.from}
                                            to={eachArrow.to}
                                            points={eachArrow.points}
                                            current={false}
                                            stroke={eachArrow.stroke}
                                            fill={eachArrow.fill}
                                        />
                                    );
                                }
                            })}

                            {selectedShapeName.includes("text") ? (
                                <TransformerComponent
                                    selectedShapeName={selectedShapeName}
                                />
                            ) : (
                                <TransformerComponent
                                    selectedShapeName={selectedShapeName}
                                />
                            )}
                        </Layer>

                        <Layer
                            height={window.innerHeight}
                            width={window.innerWidth}
                            ref={layerRef}
                        >
                            <Toolbar
                                layer={layerRef.layer2}
                                rectName={
                                    rectangles.length + 1 + state.rectDeleteCount
                                }
                                ellipseName={
                                    ellipses.length + 1 + state.ellipseDeleteCount
                                }
                                starName={
                                    stars.length + 1 + state.starDeleteCount
                                }
                                textName={
                                    texts.length + 1 + state.textDeleteCount
                                }
                                newArrowOnDragEnd={toPush => {
                                    if (toPush.from !== undefined) {

                                        transform = layerRef.layer2
                                            .getAbsoluteTransform()
                                            .copy();
                                        transform.invert();
                                        let uh = transform.point({
                                            x: toPush.x,
                                            y: toPush.y
                                        });
                                        toPush.x = uh.x;
                                        toPush.y = uh.y;

                                        newArrow = {
                                            points: toPush.points,
                                            ref:
                                                "arrow" +
                                                (arrows.length +
                                                    1 +
                                                    state.arrowDeleteCount),
                                            name:
                                                "arrow" +
                                                (arrows.length +
                                                    1 +
                                                    state.arrowDeleteCount),
                                            from: toPush.from,
                                            stroke: toPush.stroke,
                                            strokeWidth: toPush.strokeWidth,
                                            fill: toPush.fill
                                        };

                                        setState(prevState => ({
                                            arrows: [...prevState.arrows, newArrow],
                                            newArrowDropped: true,
                                            newArrowRef: newArrow.name,
                                            arrowEndX: toPush.x,
                                            arrowEndY: toPush.y
                                        }));
                                    } else {
                                        var transform = layerRef.layer2
                                            .getAbsoluteTransform()
                                            .copy();
                                        transform.invert();
                                        let uh = transform.point({
                                            x: toPush.x,
                                            y: toPush.y
                                        });
                                        toPush.x = uh.x;
                                        toPush.y = uh.y;
                                        var newArrow = {
                                            points: [toPush.x, toPush.y, toPush.x, toPush.y],
                                            ref:
                                                "arrow" +
                                                (arrows.length +
                                                    1 +
                                                    state.arrowDeleteCount),
                                            name:
                                                "arrow" +
                                                (arrows.length +
                                                    1 +
                                                    state.arrowDeleteCount),
                                            from: toPush.from,
                                            stroke: toPush.stroke,
                                            strokeWidth: toPush.strokeWidth,
                                            fill: toPush.fill
                                        };

                                        setState(prevState => ({
                                            arrows: [...prevState.arrows, newArrow],
                                            newArrowDropped: true,
                                            newArrowRef: newArrow.name,
                                            arrowEndX: toPush.x,
                                            arrowEndY: toPush.y
                                        }));
                                    }

                                }}
                                appendToRectangles={stuff => {
                                    var layer = layerRef.layer2;
                                    var toPush = stuff;
                                    var transform = layerRef.layer2
                                        .getAbsoluteTransform()
                                        .copy();
                                    transform.invert();

                                    var pos = transform.point({
                                        x: toPush.x,
                                        y: toPush.y
                                    });

                                    if (layer.attrs.x !== null || true) {
                                        toPush.x = pos.x;
                                        toPush.y = pos.y;
                                    }

                                    setState(prevState => ({
                                        rectangles: [...prevState.rectangles, toPush],
                                        selectedShapeName: toPush.name
                                    }));
                                }}
                                appendToEllipses={stuff => {
                                    var layer = layerRef.layer2;
                                    var toPush = stuff;
                                    var transform = layerRef.layer2
                                        .getAbsoluteTransform()
                                        .copy();
                                    transform.invert();

                                    var pos = transform.point({
                                        x: toPush.x,
                                        y: toPush.y
                                    });

                                    if (layer.attrs.x !== null || true) {
                                        toPush.x = pos.x;
                                        toPush.y = pos.y;
                                    }

                                    setState(prevState => ({
                                        ellipses: [...prevState.ellipses, toPush],
                                        selectedShapeName: toPush.name
                                    }));
                                }}
                                appendToStars={stuff => {
                                    var layer = layerRef.layer2;
                                    var toPush = stuff;
                                    var transform = layerRef.layer2
                                        .getAbsoluteTransform()
                                        .copy();
                                    transform.invert();

                                    var pos = transform.point({
                                        x: toPush.x,
                                        y: toPush.y
                                    });

                                    if (layer.attrs.x !== null || true) {
                                        toPush.x = pos.x;
                                        toPush.y = pos.y;
                                    }
                                    setState(prevState => ({
                                        stars: [...prevState.stars, toPush],
                                        selectedShapeName: toPush.name
                                    }));
                                }}
                                appendToTexts={stuff => {
                                    var layer = layerRef.layer2;
                                    var toPush = stuff;
                                    var transform = layerRef.layer2
                                        .getAbsoluteTransform()
                                        .copy();
                                    transform.invert();

                                    var pos = transform.point({
                                        x: toPush.x,
                                        y: toPush.y
                                    });

                                    if (layer.attrs.x !== null || true) {
                                        toPush.x = pos.x;
                                        toPush.y = pos.y;
                                    }

                                    setState(prevState => ({
                                        texts: [...prevState.texts, toPush]
                                    }));
                                    let text = texts[toPush];
                                    text.fire("dblclick");
                                }}
                            />
                            {
                                //Strichmännchen in Layer
                                images.map((image)=>{
                                    return <URLImage image={image}/>
                                })
                            }
                        </Layer>
                    </Stage>

                    <textarea
                        ref={textRef}
                        id="textarea"
                        value={state.text}
                        onChange={e => {
                            setState({
                                text: e.target.value,
                                shouldTextUpdate: false
                            });
                        }}
                        onKeyDown={e => {
                            if (e.keyCode === 13) {
                                setState({
                                    textEditVisible: false,
                                    shouldTextUpdate: true
                                });

                                // get the current text
                                //match name with elements in texts,
                                let node = node[state.currentTextRef];
                                console.log("node width before set", node.textWidth);
                                let name = node.attrs.name;
                                setState(
                                    prevState => ({
                                        selectedShapeName: name,
                                        texts: prevState.texts.map(eachText =>
                                            eachText.name === name
                                                ? {
                                                    ...eachText,
                                                    text: state.text
                                                }
                                                : eachText
                                        )
                                    }),
                                    () => {
                                        setState(prevState => ({
                                            texts: prevState.texts.map(eachText =>
                                                eachText.name === name
                                                    ? {
                                                        ...eachText,
                                                        textWidth: node.textWidth,
                                                        textHeight: node.textHeight
                                                    }
                                                    : eachText
                                            )
                                        }));
                                    }
                                );

                                node.show();
                                node.graphicStage.findOne(".transformer").show();
                            }
                        }}
                        onBlur={() => {
                            setState({
                                textEditVisible: false,
                                shouldTextUpdate: true
                            });

                            // get the current text to edit

                            let node = node.graphicStage.findOne(
                                "." + state.currentTextRef
                            );
                            let name = node.attrs.name;

                            setState(
                                prevState => ({
                                    selectedShapeName: name,
                                    texts: prevState.texts.map(eachText =>
                                        eachText.name === name
                                            ? {
                                                ...eachText,
                                                text: state.text
                                            }
                                            : eachText
                                    )
                                }),
                                () => {
                                    setState(prevState => ({
                                        texts: prevState.texts.map(eachText =>
                                            eachText.name === name
                                                ? {
                                                    ...eachText,
                                                    textWidth: node.textWidth,
                                                    textHeight: node.textHeight
                                                }
                                                : eachText
                                        )
                                    }));
                                }
                            );
                            node.show();
                            node.graphicStage.findOne(".transformer").show();
                            node.graphicStage.draw();
                        }}
                        style={{
                            //set position, width, height, fontSize, overflow, lineHeight, color
                            display: state.textEditVisible ? "block" : "none",
                            position: "absolute",
                            top: state.textY + 80 + "px",
                            left: state.textX + "px",
                            width: "300px",
                            height: "300px",
                            overflow: "hidden",
                            fontSize: state.textareaFontSize,
                            fontFamily: state.textareaFontFamily,
                            color: state.textareaFill,
                            border: "none",
                            padding: "0px",
                            margin: "0px",
                            outline: "none",
                            resize: "none",
                            background: "none"
                        }}
                    />
                    <div className="errMsg">{errDisplay}</div>
                </div>
            </div>
        </div>
    );
}

export default App;