export class BezierCubica {
    constructor(puntosControl, ejeBinormal) {
        this.p0 = puntosControl[0];
        this.p1 = puntosControl[1];
        this.p2 = puntosControl[2];
        this.p3 = puntosControl[3];
        this.ejeBinormal = ejeBinormal
    }

    base0(u) { return (1 - u) * (1 - u) * (1 - u) }
    base1(u) { return 3 * (1 - u) * (1 - u) * u }
    base2(u) { return 3 * (1 - u) * u * u }
    base3(u) { return u * u * u }

    base0Der(u) { return -3 * u * u + 6 * u - 3 }
    base1Der(u) { return 9 * u * u - 12 * u + 3 }
    base2Der(u) { return -9 * u * u + 6 * u }
    base3Der(u) { return 3 * u * u }

    obtenerPunto(u) {
        const x = this.base0(u) * this.p0[0] + this.base1(u) * this.p1[0] + this.base2(u) * this.p2[0] + this.base3(u) * this.p3[0]
        const y = this.base0(u) * this.p0[1] + this.base1(u) * this.p1[1] + this.base2(u) * this.p2[1] + this.base3(u) * this.p3[1]
        const z = this.base0(u) * this.p0[2] + this.base1(u) * this.p1[2] + this.base2(u) * this.p2[2] + this.base3(u) * this.p3[2]
        return [x, y, z]
    }

    obtenerTangente(u) {
        const x = this.base0Der(u) * this.p0[0] + this.base1Der(u) * this.p1[0] + this.base2Der(u) * this.p2[0] + this.base3Der(u) * this.p3[0]
        const y = this.base0Der(u) * this.p0[1] + this.base1Der(u) * this.p1[1] + this.base2Der(u) * this.p2[1] + this.base3Der(u) * this.p3[1]
        const z = this.base0Der(u) * this.p0[2] + this.base1Der(u) * this.p1[2] + this.base2Der(u) * this.p2[2] + this.base3Der(u) * this.p3[2]
        const norma = Math.sqrt(x * x + y * y + z * z)
        return [x/norma, y/norma, z/norma]
    }
}