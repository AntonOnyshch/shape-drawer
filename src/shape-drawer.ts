export class ShapeDrawer
{
    public static drawLine(params = {
        coors: {x0:0, y0:0, x1:0, y1:0}, 
        color: 0, 
        width: 0, 
        data: new ArrayBuffer(0)
    }) {
        let x0 = params.coors.x0;
        let y0 = params.coors.y0;
        let x1 = params.coors.x1;
        let y1 = params.coors.y1;

        //Steep is true if the width of line is less than height
        let steep = false;

        // if the line is steep, we transpose the coordinates
        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            x0 = x0 ^ y0;
            y0 = x0 ^ y0;
            x0 = x0 ^ y0;

            x1 = x1 ^ y1;
            y1 = x1 ^ y1;
            x1 = x1 ^ y1;
            steep = true;
        }
        
        // make it left-to-right if x0 > x1
        if (x0 > x1) {
            x0 = x0 ^ x1;
            x1 = x0 ^ x1;
            x0 = x0 ^ x1;

            y0 = y0 ^ y1;
            y1 = y0 ^ y1;
            y0 = y0 ^ y1;
        }
        const dx = x1 - x0;
        const derror = Math.abs(y1 - y0) * 2;
        const errorLut = ((1 | ((y1 - y0) >> 31)) << 16) + dx * 2;
        const data = new Uint32Array(params.data);
        let error = 0;
        let y = y0;
        let x = x0;
        let pixel = 0;
        let errortmp = 0;

        //Calculate error
        const _setError = () => {
            error += derror;
            errortmp = (error - dx) >> 31;
            y += (errorLut >> 16) * ++errortmp;
            error -= (errorLut & 65535) * errortmp;
        }
        //If line is steep we treat it like from up to down(or down to up)
        if(steep) {
            for (; x < x1; x++) {
                pixel = x * params.width + y;
                data[pixel] = params.color;
                _setError();
            }
        }
        else {//from left to right(or right to left)
            for (; x < x1; x++) {
                pixel = y * params.width + x;
                data[pixel] = params.color;
                _setError();
            }
        }
    }

    public static clearBuffer(params = {width: 0, height: 0, data: new ArrayBuffer(0)}) {
        const color = 255 << 24;
        const data = new Uint32Array(params.data);
        let pixel = 0;
        for (let i = 0; i < params.height; i++) {
            for (let j = 0; j < params.width; j++) {
                pixel = i * params.width + j;
                data[pixel] = color;
            }
        }
    }
    public static drawRectangle(params = {
        coors: {x0:0, y0:0, x1:0, y1:0}, 
        color: 0, 
        width: 0, 
        data: new ArrayBuffer(0)
    }) {
        const data = new Uint32Array(params.data);
        let pixel = 0;
        let x0 = params.coors.x0;
        let y0 = params.coors.y0;
        let x1 = params.coors.x1;
        let y1 = params.coors.y1;

        //Steep is true if the width of line is less than height
        let steep = false;

        // if the line is steep, we transpose the coordinates
        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            x0 = x0 ^ y0;
            y0 = x0 ^ y0;
            x0 = x0 ^ y0;

            x1 = x1 ^ y1;
            y1 = x1 ^ y1;
            x1 = x1 ^ y1;
            steep = true;
        }
        // make it left-to-right if x0 > x1
        if (x0 > x1) {
            x0 = x0 ^ x1;
            x1 = x0 ^ x1;
            x0 = x0 ^ x1;

            y0 = y0 ^ y1;
            y1 = y0 ^ y1;
            y0 = y0 ^ y1;
        }

        for (let i = y0; i < y1; i++) {
            for (let j = x0; j < x1; j++) {
                pixel = i * params.width + j;
                data[pixel] = params.color;
            }
        }
    }

}