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
        const ParedCastillo = await initTexture('images/paredLadrillos.jpg',gl);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, ParedCastillo);

        const TejasAzules = await initTexture('images/tejasAzules.jpg',gl);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, TejasAzules);

        const Piedra = await initTexture('images/piedra2.jpg',gl);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, Piedra);

        // const TEXTURA_MADERA_CLARA = await initTexture('images/madera_clara_1k.jpg');
        const MaderaClara = await initTexture('images/maderaCorteza.jpg',gl);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, MaderaClara);

        const TablonMadera = await initTexture('images/tablonesMadera2.jpg',gl);
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, TablonMadera);

        const Pasto1 = await initTexture('images/suelo1.jpg',gl);
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, Pasto1);

        const Agua = await initTexture('images/agua.jpg',gl);
        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_2D, Agua);

        const Pasto2 = await initTexture('images/pasto_aux2.jpg',gl);
        gl.activeTexture(gl.TEXTURE7);
        gl.bindTexture(gl.TEXTURE_2D, Pasto1);

        const Pasto3 = await initTexture('images/pasto_aux.jpg',gl);
        gl.activeTexture(gl.TEXTURE8);
        gl.bindTexture(gl.TEXTURE_2D, Pasto1);

        const Test = await initTexture('images/uv.jpg',gl);
        gl.activeTexture(gl.TEXTURE9);
        gl.bindTexture(gl.TEXTURE_2D, Test);

        const Cielo = await initTexture('images/cielo2.jpg',gl);
        gl.activeTexture(gl.TEXTURE10);
        gl.bindTexture(gl.TEXTURE_2D, Cielo);

        const PastoRoca = await initTexture('images/pastoRoca.jpg',gl);
        gl.activeTexture(gl.TEXTURE11);
        gl.bindTexture(gl.TEXTURE_2D, PastoRoca);

        const PastoNM = await initTexture('images/pastoNMap.jpg',gl);
        gl.activeTexture(gl.TEXTURE12);
        gl.bindTexture(gl.TEXTURE_2D, PastoNM);

        const PastoRocaNM = await initTexture('images/pastoRocaNMap.jpg',gl);
        gl.activeTexture(gl.TEXTURE13);
        gl.bindTexture(gl.TEXTURE_2D, PastoRocaNM);

        const PiedraNM = await initTexture('images/piedra2NMap.png',gl);
        gl.activeTexture(gl.TEXTURE14);
        gl.bindTexture(gl.TEXTURE_2D, PiedraNM);

        const AguaNM = await initTexture('images/aguaNM.png',gl);
        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, AguaNM);

        const ParedCastilloNM = await initTexture('images/paredLadrillosNM.jpg',gl);
        gl.activeTexture(gl.TEXTURE16);
        gl.bindTexture(gl.TEXTURE_2D, ParedCastilloNM);

        const TablonMaderaNM = await initTexture('images/tablonesMadera2NM.jpg',gl);
        gl.activeTexture(gl.TEXTURE17);
        gl.bindTexture(gl.TEXTURE_2D, TablonMaderaNM);

        const TejasAzulesNM = await initTexture('images/tejasAzulesNM.png',gl);
        gl.activeTexture(gl.TEXTURE18);
        gl.bindTexture(gl.TEXTURE_2D, TejasAzulesNM);

        const MaderaCortezaNM = await initTexture('images/maderaCortezaNM.jpg',gl);
        gl.activeTexture(gl.TEXTURE19);
        gl.bindTexture(gl.TEXTURE_2D, MaderaCortezaNM);

        const Negro = await initTexture('images/negro.jpg',gl);
        gl.activeTexture(gl.TEXTURE20);
        gl.bindTexture(gl.TEXTURE_2D, Negro);

        const texturas = [
            ParedCastillo,
            TejasAzules,
            Piedra,
            MaderaClara,
            TablonMadera,
            Pasto1,
            Agua,
            Pasto2,
            Pasto3,
            Test,
            Cielo,
            PastoRoca,
            PastoNM,
            PastoRocaNM,
            PiedraNM,
            AguaNM,
            ParedCastilloNM,
            TablonMaderaNM,
            TejasAzulesNM,
            MaderaCortezaNM,
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
        this.TablonMadera = texturas[4];
        this.Agua = texturas[6]
        this.Pasto1 = texturas[5];
        this.Pasto2 = texturas[7]
        this.Pasto3 = texturas[8]
        this.Test = texturas[9]
        this.Cielo = texturas[10];
        this.PastoRoca = texturas[11];
        this.PastoNM = texturas[12];
        this.PastoRocaNM = texturas[13];
        this.PiedraNM = texturas[14];
        this.AguaNM = texturas[15];
        this.ParedCastilloNM = texturas[16];
        this.TablonMaderaNM = texturas[17];
        this.TejasAzulesNM = texturas[18];
        this.MaderaCortezaNM = texturas[19];
        this.Negro = texturas[texturas.length-1];
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