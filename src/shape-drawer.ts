export class ShapeDrawer
{
    public static drawLine(
        x0:number, y0:number, x1:number, y1:number,
        color: 0, width: 0, data: ArrayBufferLike)
    {
        //Steep is true if the width of line is less than height
        let steep = false;

        const coors = ShapeDrawer.transformCoordinates(x0, y0, x1, y1);

        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            steep = true;
        }

        const dx = coors[2] - coors[0];
        const derror = Math.abs(coors[3] - coors[1]) * 2;
        const errorLut = ((1 | ((coors[3] - coors[1]) >> 31)) << 16) + dx * 2;
        const array = new Uint32Array(data);
        let error = 0;
        let y = coors[1];
        let x = coors[0];
        let errortmp = 0;

        //If line is steep we treat it like from up to down(or down to up)
        if(steep) {
            for (; x < coors[2]; x++) {
                array[x * width + y] = color;

                error += derror;
                errortmp = (error - dx) >> 31;
                y += (errorLut >> 16) * ++errortmp;
                error -= (errorLut & 65535) * errortmp;
            }
        }
        else {//from left to right(or right to left)
            for (; x < coors[2]; x++) {
                array[y * width + x] = color;

                error += derror;
                errortmp = (error - dx) >> 31;
                y += (errorLut >> 16) * ++errortmp;
                error -= (errorLut & 65535) * errortmp;
            }
        }
    }
    public static clearBuffer(
        width: 0, height: 0, data: ArrayBufferLike)
    {
        const color = 255 << 24;
        const array = new Uint32Array(data);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                array[i * width + j] = color;
            }
        }
    }
    public static drawRect(
        x0:0, y0:0, x1:0, y1:0,
        color: 0, width: 0, data: ArrayBufferLike)
    {
        const array = new Uint32Array(data);
        const coors = ShapeDrawer.transformCoordinates(x0, y0, x1, y1);
        let j = x0;

        for (let i = y0; i < y1; i++) {
            for (j = x0; j < x1; j++) {
                array[i * width + j] = color;
            }
        }
    }
    public static drawRect_double(
        x0:0, y0:0, x1:0, y1:0,
        color: 0, width: 0, data: ArrayBufferLike)
    {
        const array = new Uint32Array(data);
        const coors = ShapeDrawer.transformCoordinates(x0, y0, x1, y1);
 
        let j = coors[0];
        let y = coors[3];
        const middley1 = ((((coors[3] - coors[1]) * 0.5) + 0.5) | 0) + coors[1] + 1;

        for (let i = coors[1]; i < middley1; i++) {
            j = coors[0];
            for (; j < coors[2]; j++) {
                array[i * width + j] = color;
                array[y * width + j] = color;
            }
            y--;
        }
    }
    public static shiftRectRight(
        x0:0, y0:0, x1:0, y1:0,
        color: 0, width: 0, data: ArrayBufferLike)
    {
        const array = new Uint32Array(data);
        const coors = ShapeDrawer.transformCoordinates(x0, y0, x1, y1);
        const blankColor = 255 << 24;

        for (let i = coors[1]; i < coors[3] + 1; i++) {
            array[i * width + coors[0]] = blankColor;
            array[i * width + coors[3]] = color;
        }
    }
    public static drawTriangle(
        a:Array<number>, b:Array<number>, c:Array<number>, 
        color: number, width: number, data: ArrayBufferLike)
    {
        let tValueSwap:number, x1:number, x2:number, sy:number, tmp:number;
        const array = new Uint32Array(data);
        if(a[1] > b[1]) {
            tValueSwap = a[0];
            a[0] = b[0];
            b[0] = tValueSwap;

            tValueSwap = a[1];
            a[1] = b[1];
            b[1] = tValueSwap;
        }
        if(a[1] > c[1]) {
            tValueSwap = a[0];
            a[0] = c[0];
            c[0] = tValueSwap;

            tValueSwap = a[1];
            a[1] = c[1];
            c[1] = tValueSwap;
        }
        if(b[1] > c[1]) {
            tValueSwap = b[0];
            b[0] = c[0];
            c[0] = tValueSwap;

            tValueSwap = b[1];
            b[1] = c[1];
            c[1] = tValueSwap;
        }
        const ca = (c[0] - a[0]) / (c[1] - a[1]);
        const ba = (b[0] - a[0]) / (b[1] - a[1]);
        const cb = (c[0] - b[0]) / (c[1] - b[1]);

        let i = 0;
        for (sy = a[1]; sy <= c[1]; sy++) {
            x1 = a[0] + (sy - a[1]) * ca;
            if (sy < b[1]) {
                x2 = a[0] + (sy - a[1]) * ba;
            } else {
                if(c[1] === b[1]) {
                    x2 = b[0];
                } else {
                    x2 = b[0] + (sy - b[1]) * cb;
                }
            }
            if (x1 > x2) { tmp = x1; x1 = x2; x2 = tmp; }

            x1 = Math.round(x1);
            x2 = Math.round(x2);
            
            for (i = x1; i < x2 + 1; i++)
            {
                array[sy * width + i] = color;
            }
        }
    }
    public static drawCircle(
        x1: number, y1: number, r: number, strokeThickness: number, 
        stroke: number, width: number, data: ArrayBufferLike) {
        let newR = 0;
        for (let i = 0; i < strokeThickness; i++)
        {
            newR = r + i;
            let pixel1: number, pixel2: number, pixel3: number, pixel4: number;
            let x = 0;
            let y = newR;
            let delta = 1 - 2 * newR;
            let error = 0;
            const array = new Uint32Array(data);
            while (y >= 0) {
                pixel1 = (y1 + y) * width + (x1 + x);
                pixel2 = (y1 - y) * width + (x1 + x);
                pixel3 = (y1 + y) * width + (x1 - x);
                pixel4 = (y1 - y) * width + (x1 - x);


                array[pixel1] = stroke;
                array[pixel2] = stroke;
                array[pixel3] = stroke;
                array[pixel4] = stroke;

                error = 2 * (delta + y) - 1;
                if ((delta < 0) && (error <= 0)) {
                    delta += 2 * ++x + 1;
                    continue;
                }
                if ((delta > 0) && (error >= 0)) {
                    delta -= 2 * --y + 1;
                    continue;
                }
                delta += 2 * (++x - y--);
            }
        }
    }
    private static transformCoordinates(
        x0: number, y0: number, x1: number, y1: number) : Array<number>
    {
        // if the line is steep, we transpose the coordinates
        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            x0 = x0 ^ y0;
            y0 = x0 ^ y0;
            x0 = x0 ^ y0;

            x1 = x1 ^ y1;
            y1 = x1 ^ y1;
            x1 = x1 ^ y1;
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

        return [x0, y0, x1, y1];
    }
}