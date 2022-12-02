const initTexture = async (src, gl) => {
    return new Promise((resolve, reject) => {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        // Asynchronously load an image
        var image = new Image();
        image.src = src;
        image.addEventListener('load', function () {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            resolve(texture);
        });

        image.addEventListener('error', function (err) {
            console.log("initTexture -> err", err)
            reject(err);
        });
    })
}

class TextureManager {
    static async init(gl) {
        const ParedCastillo = await initTexture('images/grey_roof_tiles_02_diff_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, ParedCastillo);

        const TejasAzules = await initTexture('images/red_slate_roof_tiles_01_diff_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, TejasAzules);

        const Piedra = await initTexture('images/rock_05_diff_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, Piedra);

        // const TEXTURA_MADERA_CLARA = await initTexture('images/madera_clara_1k.jpg');
        const MaderaClara = await initTexture('images/madera_clara_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, MaderaClara);

        const MaderaOscura = await initTexture('images/madera_oscura_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, MaderaOscura);

        const Pasto1 = await initTexture('images/grass_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, Pasto1);

        const Agua = await initTexture('images/water_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_2D, Agua);

        const Pasto2 = await initTexture('images/grass2_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE7);
        gl.bindTexture(gl.TEXTURE_2D, Pasto1);

        const Pasto3 = await initTexture('images/grass3_1k.jpg',gl);
        gl.activeTexture(gl.TEXTURE8);
        gl.bindTexture(gl.TEXTURE_2D, Pasto1);

        const Negro = await initTexture('images/black.jpg',gl);
        gl.activeTexture(gl.TEXTURE9);
        gl.bindTexture(gl.TEXTURE_2D, Negro);

        const texturas = [
            ParedCastillo,
            TejasAzules,
            Piedra,
            MaderaClara,
            MaderaOscura,
            Pasto1,
            Agua,
            Pasto2,
            Pasto3,
            Negro,
        ];
        return new TextureManager(texturas, gl);
    }

    constructor(texturas, gl) {
        this.gl = gl

        this.texturas = texturas;
        this.ParedCastillo = texturas[0];
        this.TejasAzules = texturas[1];
        this.Piedra = texturas[2];
        this.MaderaClara = texturas[3];
        this.MaderaOscura = texturas[4];
        this.Agua = texturas[6]
        this.Pasto1 = texturas[5];
        this.Pasto2 = texturas[7]
        this.Pasto3 = texturas[8]
        this.Negro = texturas[texturas.length - 1];
    }

    getTextureUnit(texture) {
        const {gl} = this

        const idx = this.texturas.indexOf(texture);
        if (idx !== -1) {
            gl.activeTexture(gl[`TEXTURE${idx}`]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return idx;
        } else {
            return this.getTextureUnit(this.Negro);
        }
    }
}

export default TextureManager;