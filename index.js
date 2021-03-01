import {ShapeDrawer} from './dist/shape-drawer.min.js';

window.shapeDrawer = {
    canvas: undefined,
    canvasCTX: undefined,
    canvasImageData: undefined,
    activeTab: '',
    colors: {
        white: (255 << 24) + (255 << 16) + (255 << 8) + 255,
        blank: (255 << 24)
    },
    init: function (canvas) {
        this.canvas = canvas;
        this.canvasCTX = canvas.getContext("2d", {alpha: false});
        this.canvasImageData = this.canvasCTX.getImageData(0,0, canvas.width, canvas.height);
        this.openTab('Lines');
    },
    openTab: function openTab(name) {
        // Declare all variables
        let i, tabcontent, tablinks;
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(name).style.display = "block";
        document.getElementById(name).className += " active";

        this.activeTab = name;
        this.initExample();
    },
    initExample: function initExample() {
        const width = this.canvasImageData.width;
        const buffer =  this.canvasImageData.data.buffer;
        const whiteColor = this.colors.white;
        const blankColor = this.colors.blank;
        const centerX = Math.round(this.canvasImageData.width * 0.5);
        const centerY = Math.round(this.canvasImageData.height * 0.5);
        switch (this.activeTab) {
            case 'Lines':
            {
                const params = {
                    coors: {
                        x0: centerX, 
                        y0: centerY, 
                        x1: centerX + 100, 
                        y1: centerX + 100
                    },
                    color: this.colors.white,
                    width: this.canvasImageData.width,
                    data: this.canvasImageData.data.buffer
                }

                ShapeDrawer.drawLine(params);
                this.canvasCTX.putImageData(this.canvasImageData, 0, 0);
                params.color = blankColor;
                ShapeDrawer.drawLine(params);

                this.canvas.onmousemove = (e) => {
                    params.color = whiteColor;
                    params.coors.x0 = centerX;
                    params.coors.y0 = centerY;
                    params.coors.x1 = e.offsetX;
                    params.coors.y1 = e.offsetY;
                    ShapeDrawer.drawLine(params);
                    this.canvasCTX.putImageData(this.canvasImageData, 0, 0);
                    params.color = blankColor;
                    ShapeDrawer.drawLine(params);
                }
            }
            break;
            case 'Circles':
            {
                this.canvas.onmousemove = undefined;
    
                ShapeDrawer.drawCircle(centerX, centerY, 100, 5, whiteColor, width, buffer);
                this.canvasCTX.putImageData(this.canvasImageData, 0, 0);
                ShapeDrawer.drawCircle(centerX, centerY, 100, 5, blankColor, width, buffer);
            }
            break;
            case 'Rectangles':
            {
                this.canvas.onmousemove = undefined;
                
                const halfWidth = Math.round(this.canvasImageData.width * 0.5);
                const halfHeight = Math.round(this.canvasImageData.height * 0.5);

                ShapeDrawer.drawRect_double(halfWidth - 100, halfHeight - 100, halfWidth, halfHeight, 
                    whiteColor, width, buffer);

                this.canvasCTX.putImageData(this.canvasImageData, 0, 0);

                ShapeDrawer.drawRect_double(halfWidth - 100, halfHeight - 100, halfWidth, halfHeight, 
                    blankColor, width, buffer);

                this.canvas.onmousemove = (e) => {
                    ShapeDrawer.drawRect_double(e.offsetX - 50, e.offsetY - 50, e.offsetX + 50, e.offsetY + 50,
                        whiteColor, width, buffer);
                    this.canvasCTX.putImageData(this.canvasImageData, 0, 0);
                    ShapeDrawer.drawRect_double(e.offsetX - 50, e.offsetY - 50, e.offsetX + 50, e.offsetY + 50,
                        blankColor, width, buffer);
                }
            }
            break;
            case 'Triangles':
            {
                this.canvas.onmousemove = undefined;
    
                ShapeDrawer.drawTriangle([centerX, centerY - 100], [centerX - 100, centerY + 50], [centerX + 100, centerY + 50], 
                    whiteColor, width, buffer);
                this.canvasCTX.putImageData(this.canvasImageData, 0, 0);
                ShapeDrawer.drawTriangle([centerX, centerY - 100], [centerX - 100, centerY + 50], [centerX + 100, centerY + 50], 
                    blankColor, width, buffer);
            }
            break;
            default:
                break;
        }
    }
}

