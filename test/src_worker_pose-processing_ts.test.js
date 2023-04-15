(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["v3d-web"] = factory();
	else
		root["v3d-web"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper/basis.ts":
/*!*****************************!*\
  !*** ./src/helper/basis.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Basis": () => (/* binding */ Basis),
/* harmony export */   "calcAvgPlane": () => (/* binding */ calcAvgPlane),
/* harmony export */   "getBasis": () => (/* binding */ getBasis),
/* harmony export */   "quaternionBetweenBases": () => (/* binding */ quaternionBetweenBases)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _quaternion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quaternion */ "./src/helper/quaternion.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/helper/utils.ts");
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Calculate 3D rotations



class Basis {
    get x() {
        return this._data[0];
    }
    get y() {
        return this._data[1];
    }
    get z() {
        return this._data[2];
    }
    constructor(v33, leftHanded = true, eps = 1e-6) {
        this.leftHanded = leftHanded;
        this.eps = eps;
        this._data = Basis.getOriginalCoordVectors();
        if (v33 && v33.every((v) => (0,_utils__WEBPACK_IMPORTED_MODULE_2__.validVector3)(v)))
            this.set(v33);
        this._data.forEach((v) => {
            Object.freeze(v);
        });
    }
    get() {
        return this._data;
    }
    set(v33) {
        this.x.copyFrom(v33[0]);
        this.y.copyFrom(v33[1]);
        this.z.copyFrom(v33[2]);
        this.verifyBasis();
    }
    verifyBasis() {
        const z = this.leftHanded ? this.z : this.z.negate();
        if (!(0,_quaternion__WEBPACK_IMPORTED_MODULE_1__.vectorsSameDirWithinEps)(this.x.cross(this.y), z, this.eps))
            throw Error("Basis is not correct!");
    }
    rotateByQuaternion(q) {
        const newBasisVectors = [_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero()];
        this._data.map((v, i) => {
            v.rotateByQuaternionToRef(q, newBasisVectors[i]);
        });
        return new Basis(newBasisVectors);
    }
    // Basis validity is not checked!
    negateAxes(axis) {
        const x = this.x.clone();
        const y = this.y.clone();
        const z = this.z.clone();
        switch (axis) {
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.x:
                x.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.y:
                y.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.z:
                z.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.xy:
                x.negateInPlace();
                y.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.yz:
                y.negateInPlace();
                z.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.xz:
                x.negateInPlace();
                z.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.xyz:
                x.negateInPlace();
                y.negateInPlace();
                z.negateInPlace();
                break;
            default:
                throw Error("Unknown axis!");
        }
        return new Basis([x, y, z]);
    }
    transpose(order) {
        // Sanity check
        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_2__.setEqual)(new Set(order), new Set([0, 1, 2]))) {
            console.error("Basis transpose failed: wrong input.");
            return this;
        }
        const data = [this.x.clone(), this.y.clone(), this.z.clone()];
        const newData = order.map(i => data[i]);
        return new Basis(newData);
    }
    static getOriginalCoordVectors() {
        return Basis.ORIGINAL_CARTESIAN_BASIS_VECTORS.map(v => v.clone());
    }
}
Basis.ORIGINAL_CARTESIAN_BASIS_VECTORS = [
    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(1, 0, 0),
    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1),
];
function quaternionBetweenBases(basis1, basis2, prevQuaternion) {
    let thisBasis1 = basis1, thisBasis2 = basis2;
    if (prevQuaternion !== undefined) {
        const extraQuaternionR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(prevQuaternion);
        thisBasis1 = basis1.rotateByQuaternion(extraQuaternionR);
        thisBasis2 = basis2.rotateByQuaternion(extraQuaternionR);
    }
    const rotationBasis1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisBasis1.x.clone(), thisBasis1.y.clone(), thisBasis1.z.clone());
    const rotationBasis2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisBasis2.x.clone(), thisBasis2.y.clone(), thisBasis2.z.clone());
    const quaternion31 = rotationBasis1.clone().normalize();
    const quaternion31R = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(quaternion31);
    const quaternion32 = rotationBasis2.clone().normalize();
    return quaternion32.multiply(quaternion31R);
}
/*
 * Left handed for BJS.
 * Each object is defined by 3 points.
 * Assume a is origin, b points to +x, abc forms XY plane.
 */
function getBasis(obj) {
    const [a, b, c] = obj;
    const planeXY = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPoints(a, b, c).normalize();
    const axisX = b.subtract(a).normalize();
    const axisZ = planeXY.normal;
    // Project c onto ab
    const cp = a.add(axisX.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(c.subtract(a), axisX) / _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(axisX, axisX)));
    const axisY = c.subtract(cp).normalize();
    return new Basis([axisX, axisY, axisZ]);
}
// Project points to an average plane
function calcAvgPlane(pts, normal) {
    if (pts.length === 0)
        return [_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero()];
    const avgPt = pts.reduce((prev, curr) => {
        return prev.add(curr);
    }).scale(1 / pts.length);
    const ret = pts.map((v) => {
        return v.subtract(normal.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(normal, v.subtract(avgPt))));
    });
    return ret;
}


/***/ }),

/***/ "./src/helper/filter.ts":
/*!******************************!*\
  !*** ./src/helper/filter.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EuclideanHighPassFilter": () => (/* binding */ EuclideanHighPassFilter),
/* harmony export */   "GaussianVectorFilter": () => (/* binding */ GaussianVectorFilter),
/* harmony export */   "KalmanVectorFilter": () => (/* binding */ KalmanVectorFilter),
/* harmony export */   "OneEuroVectorFilter": () => (/* binding */ OneEuroVectorFilter),
/* harmony export */   "VISIBILITY_THRESHOLD": () => (/* binding */ VISIBILITY_THRESHOLD),
/* harmony export */   "gaussianKernel1d": () => (/* binding */ gaussianKernel1d)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var kalmanjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! kalmanjs */ "./node_modules/kalmanjs/lib/kalman.js");
/* harmony import */ var kalmanjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(kalmanjs__WEBPACK_IMPORTED_MODULE_1__);
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


const VISIBILITY_THRESHOLD = 0.6;
// 1D Gaussian Kernel
const gaussianKernel1d = (function () {
    let sqr2pi = Math.sqrt(2 * Math.PI);
    return function gaussianKernel1d(size, sigma) {
        // ensure size is even and prepare variables
        let width = (size / 2) | 0, kernel = new Array(width * 2 + 1), norm = 1.0 / (sqr2pi * sigma), coefficient = 2 * sigma * sigma, total = 0, x;
        // set values and increment total
        for (x = -width; x <= width; x++) {
            total += kernel[width + x] = norm * Math.exp(-x * x / coefficient);
        }
        // divide by total to make sure the sum of all the values is equal to 1
        for (x = 0; x < kernel.length; x++) {
            kernel[x] /= total;
        }
        return kernel;
    };
}());
/*
 * Converted from https://github.com/jaantollander/OneEuroFilter.
 */
class OneEuroVectorFilter {
    constructor(t_prev, x_prev, dx_prev = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), min_cutoff = 1.0, beta = 0.0, d_cutoff = 1.0) {
        this.t_prev = t_prev;
        this.x_prev = x_prev;
        this.dx_prev = dx_prev;
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.d_cutoff = d_cutoff;
    }
    static smoothing_factor(t_e, cutoff) {
        const r = 2 * Math.PI * cutoff * t_e;
        return r / (r + 1);
    }
    static exponential_smoothing(a, x, x_prev) {
        return x.scale(a).addInPlace(x_prev.scale((1 - a)));
    }
    next(t, x) {
        const t_e = t - this.t_prev;
        // The filtered derivative of the signal.
        const a_d = OneEuroVectorFilter.smoothing_factor(t_e, this.d_cutoff);
        const dx = x.subtract(this.x_prev).scaleInPlace(1 / t_e);
        const dx_hat = OneEuroVectorFilter.exponential_smoothing(a_d, dx, this.dx_prev);
        // The filtered signal.
        const cutoff = this.min_cutoff + this.beta * dx_hat.length();
        const a = OneEuroVectorFilter.smoothing_factor(t_e, cutoff);
        const x_hat = OneEuroVectorFilter.exponential_smoothing(a, x, this.x_prev);
        // Memorize the previous values.
        this.x_prev = x_hat;
        this.dx_prev = dx_hat;
        this.t_prev = t;
        return x_hat;
    }
}
class KalmanVectorFilter {
    constructor(R = 0.1, Q = 3) {
        this.R = R;
        this.Q = Q;
        this.kalmanFilterX = new (kalmanjs__WEBPACK_IMPORTED_MODULE_1___default())({ Q: Q, R: R });
        this.kalmanFilterY = new (kalmanjs__WEBPACK_IMPORTED_MODULE_1___default())({ Q: Q, R: R });
        this.kalmanFilterZ = new (kalmanjs__WEBPACK_IMPORTED_MODULE_1___default())({ Q: Q, R: R });
    }
    next(t, vec) {
        const newValues = [
            this.kalmanFilterX.filter(vec.x),
            this.kalmanFilterY.filter(vec.y),
            this.kalmanFilterZ.filter(vec.z),
        ];
        return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(newValues);
    }
}
class GaussianVectorFilter {
    get values() {
        return this._values;
    }
    constructor(size, sigma) {
        this.size = size;
        this.sigma = sigma;
        this._values = [];
        if (size < 2)
            throw RangeError("Filter size too short");
        this.size = Math.floor(size);
        this.kernel = gaussianKernel1d(size, sigma);
    }
    push(v) {
        this.values.push(v);
        if (this.values.length === this.size + 1) {
            this.values.shift();
        }
        else if (this.values.length > this.size + 1) {
            console.warn(`Internal queue has length longer than size: ${this.size}`);
            this.values.slice(-this.size);
        }
    }
    reset() {
        this.values.length = 0;
    }
    apply() {
        if (this.values.length !== this.size)
            return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        const ret = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        const len0 = ret.length();
        for (let i = 0; i < this.size; ++i) {
            ret.addInPlace(this.values[i].scale(this.kernel[i]));
        }
        const len1 = ret.length();
        // Normalize to original length
        ret.scaleInPlace(len0 / len1);
        return ret;
    }
}
class EuclideanHighPassFilter {
    get value() {
        return this._value;
    }
    constructor(threshold) {
        this.threshold = threshold;
        this._value = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    }
    update(v) {
        if (this.value.subtract(v).length() > this.threshold) {
            this._value = v;
        }
    }
    reset() {
        this._value = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    }
}


/***/ }),

/***/ "./src/helper/landmark.ts":
/*!********************************!*\
  !*** ./src/helper/landmark.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FACE_LANDMARK_LENGTH": () => (/* binding */ FACE_LANDMARK_LENGTH),
/* harmony export */   "FilteredLandmarkVector": () => (/* binding */ FilteredLandmarkVector),
/* harmony export */   "HAND_LANDMARKS": () => (/* binding */ HAND_LANDMARKS),
/* harmony export */   "HAND_LANDMARKS_BONE_MAPPING": () => (/* binding */ HAND_LANDMARKS_BONE_MAPPING),
/* harmony export */   "HAND_LANDMARKS_BONE_REVERSE_MAPPING": () => (/* binding */ HAND_LANDMARKS_BONE_REVERSE_MAPPING),
/* harmony export */   "HAND_LANDMARK_LENGTH": () => (/* binding */ HAND_LANDMARK_LENGTH),
/* harmony export */   "POSE_LANDMARK_LENGTH": () => (/* binding */ POSE_LANDMARK_LENGTH),
/* harmony export */   "depthFirstSearch": () => (/* binding */ depthFirstSearch),
/* harmony export */   "handLandMarkToBoneName": () => (/* binding */ handLandMarkToBoneName),
/* harmony export */   "normalizedLandmarkToVector": () => (/* binding */ normalizedLandmarkToVector),
/* harmony export */   "vectorToNormalizedLandmark": () => (/* binding */ vectorToNormalizedLandmark)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter */ "./src/helper/filter.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/helper/utils.ts");
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */



class FilteredLandmarkVector {
    get t() {
        return this._t;
    }
    set t(value) {
        this._t = value;
    }
    get pos() {
        return this._pos;
    }
    constructor(params = {
        oneEuroCutoff: 0.01,
        oneEuroBeta: 0,
        type: 'OneEuro'
    }) {
        this.gaussianVectorFilter = null;
        this._t = 0;
        this._pos = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        this.visibility = 0;
        if (params.type === "Kalman")
            this.mainFilter = new _filter__WEBPACK_IMPORTED_MODULE_1__.KalmanVectorFilter(params.R, params.Q);
        else if (params.type === "OneEuro")
            this.mainFilter = new _filter__WEBPACK_IMPORTED_MODULE_1__.OneEuroVectorFilter(this.t, this.pos, _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), params.oneEuroCutoff, params.oneEuroBeta);
        else
            throw Error("Wrong filter type!");
        if (params.gaussianSigma)
            this.gaussianVectorFilter = new _filter__WEBPACK_IMPORTED_MODULE_1__.GaussianVectorFilter(5, params.gaussianSigma);
    }
    updatePosition(pos, visibility) {
        this.t += 1;
        // Face Mesh has no visibility
        if (visibility === undefined || visibility > _filter__WEBPACK_IMPORTED_MODULE_1__.VISIBILITY_THRESHOLD) {
            pos = this.mainFilter.next(this.t, pos);
            if (this.gaussianVectorFilter) {
                this.gaussianVectorFilter.push(pos);
                pos = this.gaussianVectorFilter.apply();
            }
            this._pos = pos;
            this.visibility = visibility;
        }
    }
}
const POSE_LANDMARK_LENGTH = 33;
const FACE_LANDMARK_LENGTH = 478;
const HAND_LANDMARK_LENGTH = 21;
const normalizedLandmarkToVector = (l, scaling = 1., reverseY = false) => {
    return new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(l.x * scaling, reverseY ? -l.y * scaling : l.y * scaling, l.z * scaling);
};
const vectorToNormalizedLandmark = (l) => {
    return { x: l.x, y: l.y, z: l.z };
};
const HAND_LANDMARKS = {
    WRIST: 0,
    THUMB_CMC: 1,
    THUMB_MCP: 2,
    THUMB_IP: 3,
    THUMB_TIP: 4,
    INDEX_FINGER_MCP: 5,
    INDEX_FINGER_PIP: 6,
    INDEX_FINGER_DIP: 7,
    INDEX_FINGER_TIP: 8,
    MIDDLE_FINGER_MCP: 9,
    MIDDLE_FINGER_PIP: 10,
    MIDDLE_FINGER_DIP: 11,
    MIDDLE_FINGER_TIP: 12,
    RING_FINGER_MCP: 13,
    RING_FINGER_PIP: 14,
    RING_FINGER_DIP: 15,
    RING_FINGER_TIP: 16,
    PINKY_MCP: 17,
    PINKY_PIP: 18,
    PINKY_DIP: 19,
    PINKY_TIP: 20,
};
const HAND_LANDMARKS_BONE_MAPPING = {
    Hand: HAND_LANDMARKS.WRIST,
    ThumbProximal: HAND_LANDMARKS.THUMB_CMC,
    ThumbIntermediate: HAND_LANDMARKS.THUMB_MCP,
    ThumbDistal: HAND_LANDMARKS.THUMB_IP,
    IndexProximal: HAND_LANDMARKS.INDEX_FINGER_MCP,
    IndexIntermediate: HAND_LANDMARKS.INDEX_FINGER_PIP,
    IndexDistal: HAND_LANDMARKS.INDEX_FINGER_DIP,
    MiddleProximal: HAND_LANDMARKS.MIDDLE_FINGER_MCP,
    MiddleIntermediate: HAND_LANDMARKS.MIDDLE_FINGER_PIP,
    MiddleDistal: HAND_LANDMARKS.MIDDLE_FINGER_DIP,
    RingProximal: HAND_LANDMARKS.RING_FINGER_MCP,
    RingIntermediate: HAND_LANDMARKS.RING_FINGER_PIP,
    RingDistal: HAND_LANDMARKS.RING_FINGER_DIP,
    LittleProximal: HAND_LANDMARKS.PINKY_MCP,
    LittleIntermediate: HAND_LANDMARKS.PINKY_PIP,
    LittleDistal: HAND_LANDMARKS.PINKY_DIP,
};
const HAND_LANDMARKS_BONE_REVERSE_MAPPING = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.objectFlip)(HAND_LANDMARKS_BONE_MAPPING);
function handLandMarkToBoneName(landmark, isLeft) {
    if (!(landmark in HAND_LANDMARKS_BONE_REVERSE_MAPPING))
        throw Error("Wrong landmark given!");
    return (isLeft ? 'left' : 'right') + HAND_LANDMARKS_BONE_REVERSE_MAPPING[landmark];
}
/*
 * Depth-first search/walk of a generic tree.
 * Also returns a map for backtracking from leaf.
 */
function depthFirstSearch(rootNode, f) {
    const stack = [];
    const parentMap = new Map();
    stack.push(rootNode);
    while (stack.length !== 0) {
        // remove the first child in the stack
        const currentNode = stack.splice(-1, 1)[0];
        const retVal = f(currentNode);
        if (retVal)
            return [currentNode, parentMap];
        const currentChildren = currentNode.children;
        // add any children in the node at the top of the stack
        if (currentChildren !== null) {
            for (let index = 0; index < currentChildren.length; index++) {
                const child = currentChildren[index];
                stack.push(child);
                if (!(parentMap.has(child))) {
                    parentMap.set(child, currentNode);
                }
            }
        }
    }
    return [null, null];
}


/***/ }),

/***/ "./src/helper/quaternion.ts":
/*!**********************************!*\
  !*** ./src/helper/quaternion.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AXIS": () => (/* binding */ AXIS),
/* harmony export */   "CloneableQuaternion": () => (/* binding */ CloneableQuaternion),
/* harmony export */   "CloneableQuaternionLite": () => (/* binding */ CloneableQuaternionLite),
/* harmony export */   "DegToRad": () => (/* binding */ DegToRad),
/* harmony export */   "FilteredQuaternion": () => (/* binding */ FilteredQuaternion),
/* harmony export */   "RadToDeg": () => (/* binding */ RadToDeg),
/* harmony export */   "calcSphericalCoord": () => (/* binding */ calcSphericalCoord),
/* harmony export */   "checkQuaternion": () => (/* binding */ checkQuaternion),
/* harmony export */   "cloneableQuaternionToQuaternion": () => (/* binding */ cloneableQuaternionToQuaternion),
/* harmony export */   "degreeBetweenVectors": () => (/* binding */ degreeBetweenVectors),
/* harmony export */   "degreesEqualInQuaternion": () => (/* binding */ degreesEqualInQuaternion),
/* harmony export */   "exchangeRotationAxis": () => (/* binding */ exchangeRotationAxis),
/* harmony export */   "printQuaternion": () => (/* binding */ printQuaternion),
/* harmony export */   "quaternionBetweenVectors": () => (/* binding */ quaternionBetweenVectors),
/* harmony export */   "quaternionToDegrees": () => (/* binding */ quaternionToDegrees),
/* harmony export */   "remapDegreeWithCap": () => (/* binding */ remapDegreeWithCap),
/* harmony export */   "removeRotationAxisWithCap": () => (/* binding */ removeRotationAxisWithCap),
/* harmony export */   "reverseRotation": () => (/* binding */ reverseRotation),
/* harmony export */   "scaleRotation": () => (/* binding */ scaleRotation),
/* harmony export */   "sphericalToQuaternion": () => (/* binding */ sphericalToQuaternion),
/* harmony export */   "testQuaternionEqualsByVector": () => (/* binding */ testQuaternionEqualsByVector),
/* harmony export */   "vectorsSameDirWithinEps": () => (/* binding */ vectorsSameDirWithinEps)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/helper/utils.ts");
/* harmony import */ var _basis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./basis */ "./src/helper/basis.ts");
/* harmony import */ var _landmark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./landmark */ "./src/helper/landmark.ts");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filter */ "./src/helper/filter.ts");
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */





class CloneableQuaternionLite {
    constructor(q) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        if (q) {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        }
    }
}
class CloneableQuaternion extends CloneableQuaternionLite {
    get baseBasis() {
        return this._baseBasis;
    }
    constructor(q, basis) {
        super(q);
        this._baseBasis = basis ? basis : new _basis__WEBPACK_IMPORTED_MODULE_2__.Basis(null);
    }
    set(q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    }
    rotateBasis(q) {
        return this._baseBasis.rotateByQuaternion(q);
    }
}
const cloneableQuaternionToQuaternion = (q) => {
    const ret = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion(q.x, q.y, q.z, q.w);
    return ret;
};
class FilteredQuaternion {
    get t() {
        return this._t;
    }
    set t(value) {
        this._t = value;
    }
    get rot() {
        return this._rot;
    }
    constructor(params = {
        R: 1,
        Q: 1,
        type: 'Kalman'
    }) {
        this.gaussianVectorFilter = null;
        this._t = 0;
        this._rot = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        if (params.type === "Kalman")
            this.mainFilter = new _filter__WEBPACK_IMPORTED_MODULE_4__.KalmanVectorFilter(params.R, params.Q);
        else
            throw Error("Wrong filter type!");
        if (params.gaussianSigma)
            this.gaussianVectorFilter = new _filter__WEBPACK_IMPORTED_MODULE_4__.GaussianVectorFilter(5, params.gaussianSigma);
    }
    updateRotation(rot) {
        this.t += 1;
        let angles = rot.toEulerAngles();
        angles = this.mainFilter.next(this.t, angles);
        if (this.gaussianVectorFilter) {
            this.gaussianVectorFilter.push(angles);
            angles = this.gaussianVectorFilter.apply();
        }
        this._rot = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerVector(angles);
    }
}
var AXIS;
(function (AXIS) {
    AXIS[AXIS["x"] = 0] = "x";
    AXIS[AXIS["y"] = 1] = "y";
    AXIS[AXIS["z"] = 2] = "z";
    AXIS[AXIS["xy"] = 3] = "xy";
    AXIS[AXIS["yz"] = 4] = "yz";
    AXIS[AXIS["xz"] = 5] = "xz";
    AXIS[AXIS["xyz"] = 6] = "xyz";
    AXIS[AXIS["none"] = 10] = "none";
})(AXIS || (AXIS = {}));
// Convenience functions
const RadToDeg = (r) => {
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Angle.FromRadians(r).degrees();
};
const DegToRad = (d) => {
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Angle.FromDegrees(d).radians();
};
/**
 * Check a quaternion is valid
 * @param q Input quaternion
 */
function checkQuaternion(q) {
    return Number.isFinite(q.x) && Number.isFinite(q.y) && Number.isFinite(q.z) && Number.isFinite(q.w);
}
// Similar to three.js Quaternion.setFromUnitVectors
const quaternionBetweenVectors = (v1, v2) => {
    const angle = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.GetAngleBetweenVectors(v1, v2, _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(v1, v2));
    const axis = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(v1, v2);
    axis.normalize();
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(axis, angle);
};
/**
 * Same as above, Euler angle version
 * @param v1 Input rotation in degrees 1
 * @param v2 Input rotation in degrees 2
 * @param remapDegree Whether re-map degrees
 */
const degreeBetweenVectors = (v1, v2, remapDegree = false) => {
    return quaternionToDegrees(quaternionBetweenVectors(v1, v2), remapDegree);
};
/**
 * Re-map degrees to -180 to 180
 * @param deg Input angle in Degrees
 */
const remapDegreeWithCap = (deg) => {
    deg = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(deg, 0, 360);
    return deg < 180 ? deg : deg - 360;
};
/**
 * Convert quaternions to degrees
 * @param q Input quaternion
 * @param remapDegree whether re-map degrees
 */
const quaternionToDegrees = (q, remapDegree = false) => {
    const angles = q.toEulerAngles();
    const remapFn = remapDegree ? remapDegreeWithCap : (x) => x;
    return new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(remapFn(RadToDeg(angles.x)), remapFn(RadToDeg(angles.y)), remapFn(RadToDeg(angles.z)));
};
/**
 * Check whether two directions are close enough within a small values
 * @param v1 Input direction 1
 * @param v2 Input direction 2
 * @param eps Error threshold
 */
function vectorsSameDirWithinEps(v1, v2, eps = 1e-6) {
    return v1.cross(v2).length() < eps && _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(v1, v2) > 0;
}
/**
 * Test whether two quaternions have equal effects
 * @param q1 Input quaternion 1
 * @param q2 Input quaternion 2
 */
function testQuaternionEqualsByVector(q1, q2) {
    const testVec = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.One();
    const testVec1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    const testVec2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.One();
    testVec.rotateByQuaternionToRef(q1, testVec1);
    testVec.rotateByQuaternionToRef(q2, testVec2);
    return vectorsSameDirWithinEps(testVec1, testVec2);
}
/**
 * Same as above, Euler angle version
 * @param d1 Input degrees 1
 * @param d2 Input degrees 2
 */
function degreesEqualInQuaternion(d1, d2) {
    const q1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(DegToRad(d1.x), DegToRad(d1.y), DegToRad(d1.z));
    const q2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(DegToRad(d2.x), DegToRad(d2.y), DegToRad(d2.z));
    return testQuaternionEqualsByVector(q1, q2);
}
/**
 * Reverse rotation Euler angles on given axes
 * @param q Input quaternion
 * @param axis Axes to reverse
 */
const reverseRotation = (q, axis) => {
    if (axis === AXIS.none)
        return q;
    const angles = q.toEulerAngles();
    switch (axis) {
        case AXIS.x:
            angles.x = -angles.x;
            break;
        case AXIS.y:
            angles.y = -angles.y;
            break;
        case AXIS.z:
            angles.z = -angles.z;
            break;
        case AXIS.xy:
            angles.x = -angles.x;
            angles.y = -angles.y;
            break;
        case AXIS.yz:
            angles.y = -angles.y;
            angles.z = -angles.z;
            break;
        case AXIS.xz:
            angles.x = -angles.x;
            angles.z = -angles.z;
            break;
        case AXIS.xyz:
            angles.x = -angles.x;
            angles.y = -angles.y;
            angles.z = -angles.z;
            break;
        default:
            throw Error("Unknown axis!");
    }
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(angles.y, angles.x, angles.z);
};
/**
 * Remove rotation on given axes.
 * Optionally capping rotation (in Euler angles) on two axes.
 * This operation assumes re-mapped degrees.
 * @param q Input quaternion
 * @param axis Axes to remove
 * @param capAxis1 Capping axis 1
 * @param capLow1 Axis 1 lower range
 * @param capHigh1 Axis 1 higher range
 * @param capAxis2 Capping axis 2
 * @param capLow2 Axis 2 lower range
 * @param capHigh2 Axis 2 higher range
 */
const removeRotationAxisWithCap = (q, axis, capAxis1, capLow1, capHigh1, capAxis2, capLow2, capHigh2) => {
    const angles = quaternionToDegrees(q, true);
    switch (axis) {
        case AXIS.none:
            break;
        case AXIS.x:
            angles.x = 0;
            break;
        case AXIS.y:
            angles.y = 0;
            break;
        case AXIS.z:
            angles.z = 0;
            break;
        case AXIS.xy:
            angles.x = 0;
            angles.y = 0;
            break;
        case AXIS.yz:
            angles.y = 0;
            angles.z = 0;
            break;
        case AXIS.xz:
            angles.x = 0;
            angles.z = 0;
            break;
        case AXIS.xyz:
            angles.x = 0;
            angles.y = 0;
            angles.z = 0;
            break;
        default:
            throw Error("Unknown axis!");
    }
    if (capAxis1 !== undefined && capLow1 !== undefined && capHigh1 !== undefined) {
        switch (capAxis1) {
            case AXIS.x:
                angles.x = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.x, capLow1, capHigh1);
                break;
            case AXIS.y:
                angles.y = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.y, capLow1, capHigh1);
                break;
            case AXIS.z:
                angles.z = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.z, capLow1, capHigh1);
                break;
            default:
                throw Error("Unknown cap axis!");
        }
    }
    if (capAxis2 !== undefined && capLow2 !== undefined && capHigh2 !== undefined) {
        switch (capAxis2) {
            case AXIS.x:
                angles.x = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.x, capLow2, capHigh2);
                break;
            case AXIS.y:
                angles.y = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.y, capLow2, capHigh2);
                break;
            case AXIS.z:
                angles.z = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.z, capLow2, capHigh2);
                break;
            default:
                throw Error("Unknown cap axis!");
        }
    }
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(DegToRad(angles.y), DegToRad(angles.x), DegToRad(angles.z));
};
/**
 * Switch rotation axes.
 * @param q Input quaternion
 * @param axis1 Axis 1 to switch
 * @param axis2 Axis 2 to switch
 */
const exchangeRotationAxis = (q, axis1, axis2) => {
    const angles = [];
    q.toEulerAngles().toArray(angles);
    const angle1 = angles[axis1];
    const angle2 = angles[axis2];
    const temp = angle1;
    angles[axis1] = angle2;
    angles[axis2] = temp;
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(angles[0], angles[1], angles[2]);
};
function printQuaternion(q, s) {
    console.log(s, (0,_landmark__WEBPACK_IMPORTED_MODULE_3__.vectorToNormalizedLandmark)(quaternionToDegrees(q, true)));
}
/**
 * Result is in Radian on unit sphere (r = 1).
 * Canonical ISO 80000-2:2019 convention.
 * @param pos Euclidean local position
 * @param basis Local coordinate system basis
 */
function calcSphericalCoord(pos, basis) {
    const qToOriginal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(basis.x.clone(), basis.y.clone(), basis.z.clone())).normalize();
    const posInOriginal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    pos.rotateByQuaternionToRef(qToOriginal, posInOriginal);
    posInOriginal.normalize();
    // Calculate theta and phi
    const x = posInOriginal.x;
    const y = posInOriginal.y;
    const z = posInOriginal.z;
    const theta = Math.acos(z);
    const phi = Math.atan2(y, x);
    return [theta, phi];
}
/**
 * Assuming rotation starts from (1, 0, 0) in local coordinate system.
 * @param basis Local coordinate system basis
 * @param theta Polar angle
 * @param phi Azimuthal angle
 * @param prevQuaternion Parent quaternion to the local system
 */
function sphericalToQuaternion(basis, theta, phi, prevQuaternion) {
    const xTz = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(basis.y.clone(), -Math.PI / 2);
    const xTzBasis = basis.rotateByQuaternion(xTz);
    const q1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(xTzBasis.x.clone(), phi);
    const q1Basis = xTzBasis.rotateByQuaternion(q1);
    const q2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(q1Basis.y.clone(), theta);
    const q2Basis = q1Basis.rotateByQuaternion(q2);
    // Force result to face front
    const planeXZ = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), basis.y.clone());
    // const intermBasis = basis.rotateByQuaternion(xTz.multiply(q1).multiplyInPlace(q2));
    const intermBasis = q2Basis;
    const newBasisZ = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(intermBasis.x.clone(), planeXZ.normal);
    const newBasisY = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(newBasisZ, intermBasis.x.clone());
    const newBasis = new _basis__WEBPACK_IMPORTED_MODULE_2__.Basis([intermBasis.x, newBasisY, newBasisZ]);
    return (0,_basis__WEBPACK_IMPORTED_MODULE_2__.quaternionBetweenBases)(basis, newBasis, prevQuaternion);
}
// Scale rotation angles in place
function scaleRotation(quaternion, scale) {
    const angles = quaternion.toEulerAngles();
    angles.scaleInPlace(scale);
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerVector(angles);
}


/***/ }),

/***/ "./src/helper/utils.ts":
/*!*****************************!*\
  !*** ./src/helper/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomLoadingScreen": () => (/* binding */ CustomLoadingScreen),
/* harmony export */   "LR": () => (/* binding */ LR),
/* harmony export */   "findPoint": () => (/* binding */ findPoint),
/* harmony export */   "fixedLengthQueue": () => (/* binding */ fixedLengthQueue),
/* harmony export */   "initArray": () => (/* binding */ initArray),
/* harmony export */   "linspace": () => (/* binding */ linspace),
/* harmony export */   "objectFlip": () => (/* binding */ objectFlip),
/* harmony export */   "pointLineDistance": () => (/* binding */ pointLineDistance),
/* harmony export */   "projectVectorOnPlane": () => (/* binding */ projectVectorOnPlane),
/* harmony export */   "range": () => (/* binding */ range),
/* harmony export */   "rangeCap": () => (/* binding */ rangeCap),
/* harmony export */   "remapRange": () => (/* binding */ remapRange),
/* harmony export */   "remapRangeNoCap": () => (/* binding */ remapRangeNoCap),
/* harmony export */   "remapRangeWithCap": () => (/* binding */ remapRangeWithCap),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "setEqual": () => (/* binding */ setEqual),
/* harmony export */   "validVector3": () => (/* binding */ validVector3)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/*
Copyright (C) 2021  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

function initArray(length, initializer) {
    let arr = new Array(length);
    for (let i = 0; i < length; i++)
        arr[i] = initializer(i);
    return arr;
}
function range(start, end, step) {
    return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
}
function linspace(start, end, div) {
    const step = (end - start) / div;
    return Array.from({ length: div }, (_, i) => start + i * step);
}
function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        ret[obj[key]] = key;
    });
    return ret;
}
const rangeCap = (v, min, max) => {
    if (min > max) {
        const tmp = max;
        max = min;
        min = tmp;
    }
    return Math.max(Math.min(v, max), min);
};
const remapRange = (v, src_low, src_high, dst_low, dst_high) => {
    return dst_low + (v - src_low) * (dst_high - dst_low) / (src_high - src_low);
};
const remapRangeWithCap = (v, src_low, src_high, dst_low, dst_high) => {
    const v1 = rangeCap(v, src_low, src_high);
    return dst_low + (v1 - src_low) * (dst_high - dst_low) / (src_high - src_low);
};
const remapRangeNoCap = (v, src_low, src_high, dst_low, dst_high) => {
    return dst_low + (v - src_low) * (dst_high - dst_low) / (src_high - src_low);
};
function validVector3(v) {
    return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}
// type ReadonlyKeysOfA = ReadonlyKeys<A>;
function setEqual(as, bs) {
    if (as.size !== bs.size)
        return false;
    for (const a of as)
        if (!bs.has(a))
            return false;
    return true;
}
function projectVectorOnPlane(projPlane, vec) {
    return vec.subtract(projPlane.normal.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(vec, projPlane.normal)));
}
function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
/**
 * Simple fixed length FIFO queue.
 */
class fixedLengthQueue {
    get values() {
        return this._values;
    }
    constructor(size) {
        this.size = size;
        this._values = [];
    }
    push(v) {
        this.values.push(v);
        if (this.values.length === this.size + 1) {
            this.values.shift();
        }
        else if (this.values.length > this.size + 1) {
            console.warn(`Internal queue has length longer than size ${this.size}: Got length ${this.values.length}`);
            this._values = this.values.slice(-this.size);
        }
    }
    concat(arr) {
        this._values = this.values.concat(arr);
        if (this.values.length > this.size) {
            this._values = this.values.slice(-this.size);
        }
    }
    pop() {
        return this.values.shift();
    }
    first() {
        if (this._values.length > 0)
            return this.values[0];
        else
            return null;
    }
    last() {
        if (this._values.length > 0)
            return this._values[this._values.length - 1];
        else
            return null;
    }
    reset() {
        this.values.length = 0;
    }
    length() {
        return this.values.length;
    }
}
function findPoint(curve, x, eps = 0.001) {
    const pts = curve.getPoints();
    if (x > pts[0].x)
        return pts[0].y;
    else if (x < pts[pts.length - 1].x)
        return pts[pts.length - 1].y;
    for (let i = 0; i < pts.length; ++i) {
        if (Math.abs(x - pts[i].x) < eps)
            return pts[i].y;
    }
    return 0;
}
const LR = ["left", "right"];
class CustomLoadingScreen {
    constructor(renderingCanvas, loadingDiv) {
        this.renderingCanvas = renderingCanvas;
        this.loadingDiv = loadingDiv;
        //optional, but needed due to interface definitions
        this.loadingUIBackgroundColor = '';
        this.loadingUIText = '';
    }
    displayLoadingUI() {
        if (!this.loadingDiv)
            return;
        if (this.loadingDiv.style.display === 'none') {
            // Do not add a loading screen if there is already one
            this.loadingDiv.style.display = "initial";
        }
        // this._resizeLoadingUI();
        // window.addEventListener("resize", this._resizeLoadingUI);
    }
    hideLoadingUI() {
        if (this.loadingDiv)
            this.loadingDiv.style.display = "none";
    }
}
function pointLineDistance(point, lineEndA, lineEndB) {
    const lineDir = lineEndB.subtract(lineEndA).normalize();
    const pProj = lineEndA.add(lineDir.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(point.subtract(lineEndA), lineDir)
        / _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(lineDir, lineDir)));
    return point.subtract(pProj).length();
}


/***/ }),

/***/ "./src/worker/pose-processing.ts":
/*!***************************************!*\
  !*** ./src/worker/pose-processing.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PoseKeyPoints": () => (/* binding */ PoseKeyPoints),
/* harmony export */   "Poses": () => (/* binding */ Poses),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "poseWrapper": () => (/* binding */ poseWrapper)
/* harmony export */ });
/* harmony import */ var comlink__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! comlink */ "./node_modules/comlink/dist/esm/comlink.mjs");
/* harmony import */ var _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mediapipe/holistic */ "./node_modules/@mediapipe/holistic/holistic.js");
/* harmony import */ var _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _helper_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper/utils */ "./src/helper/utils.ts");
/* harmony import */ var _helper_landmark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helper/landmark */ "./src/helper/landmark.ts");
/* harmony import */ var _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helper/quaternion */ "./src/helper/quaternion.ts");
/* harmony import */ var _helper_basis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helper/basis */ "./src/helper/basis.ts");
/* harmony import */ var _helper_filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helper/filter */ "./src/helper/filter.ts");
/*
Copyright (C) 2021  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */








class PoseKeyPoints {
    constructor() {
        this.top_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.bottom_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_inner = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_outer = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_inner_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_outer_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_left = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_right = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_inner = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_outer = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_inner_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_outer_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_left = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_right = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_top_first = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_top_second = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_top_third = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_bottom_first = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_bottom_second = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_bottom_third = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_left = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_right = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
    }
}
class Poses {
    // Workaround for Promise problem
    updateBoneOptions(value) {
        this._boneOptions = value;
    }
    get faceMeshLandmarkIndexList() {
        return this._faceMeshLandmarkIndexList;
    }
    get faceMeshLandmarkList() {
        return this._faceMeshLandmarkList;
    }
    get keyPoints() {
        return this._keyPoints;
    }
    get faceNormal() {
        return this._faceNormal;
    }
    get leftHandNormals() {
        return this._leftHandNormals;
    }
    get rightHandNormals() {
        return this._rightHandNormals;
    }
    get poseNormals() {
        return this._poseNormals;
    }
    constructor(boneOptions, boneRotationUpdateFn) {
        this._boneRotationUpdateFn = null;
        // VRMManager
        this.bonesHierarchyTree = null;
        // Results
        this.cloneableInputResults = null;
        // Pose Landmarks
        this.inputPoseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.poseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                R: 0.1,
                Q: 5,
                type: "Kalman",
            });
        });
        this.worldPoseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                // R: 0.1, Q: 0.1, type: 'Kalman',
                R: 0.1,
                Q: 1,
                type: "Kalman",
            }); // 0.01, 0.6, 0.007
        });
        // Cannot use Vector3 directly since postMessage() erases all methods
        this.cloneablePoseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        // Face Mesh Landmarks
        this.inputFaceLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FACE_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.faceLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FACE_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                // oneEuroCutoff: 0.01, oneEuroBeta: 15, type: 'OneEuro',
                R: 0.1,
                Q: 1,
                type: "Kalman",
            }); // 0.01, 15, 0.002
        });
        this._faceMeshLandmarkIndexList = [];
        this._faceMeshLandmarkList = [];
        // Left Hand Landmarks
        this.leftWristOffset = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 0.1,
            Q: 2,
            type: "Kalman",
        }); // 0.01, 2, 0.008
        this.inputLeftHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.leftHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                R: 1,
                Q: 10,
                type: "Kalman",
            }); // 0.001, 0.6
        });
        this.cloneableLeftHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.leftHandNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        // Right Hand Landmarks
        this.rightWristOffset = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 0.1,
            Q: 2,
            type: "Kalman",
        }); // 0.01, 2, 0.008
        this.inputRightHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.rightHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                R: 1,
                Q: 10,
                type: "Kalman",
            }); // 0.001, 0.6
        });
        this.cloneableRightHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.rightHandNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        // Feet
        this.leftFootNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        this.rightFootNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        this.leftFootBasisRotation = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        this.rightFootBasisRotation = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        // Key points
        this._keyPoints = new PoseKeyPoints();
        this._blinkBase = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 1,
            Q: 1,
            type: "Kalman",
        });
        this._leftBlinkArr = new _helper_utils__WEBPACK_IMPORTED_MODULE_1__.fixedLengthQueue(10);
        this._rightBlinkArr = new _helper_utils__WEBPACK_IMPORTED_MODULE_1__.fixedLengthQueue(10);
        // Calculated properties
        this._faceNormal = { x: 0, y: 0, z: 0 };
        this._headQuaternion = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.FilteredQuaternion({
            R: 1,
            Q: 50,
            type: "Kalman",
        });
        // TODO: option: lock x rotation
        // A copy for restore bone locations
        this._initBoneRotations = {};
        // Calculated bone rotations
        this._boneRotations = {};
        this.textEncoder = new TextEncoder();
        this._leftHandNormals = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(3, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this._rightHandNormals = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(3, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this._poseNormals = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(3, // Arbitrary length for debugging
        () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.midHipPos = null;
        this.midHipInitOffset = null;
        this.midHipOffset = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 1,
            Q: 10,
            type: "Kalman",
        });
        this.initBoneRotations(); //provisional
        this._boneOptions = boneOptions;
        if (boneRotationUpdateFn)
            this._boneRotationUpdateFn = boneRotationUpdateFn;
    }
    /**
     * One time operation to set bones hierarchy from VRMManager
     * @param tree root node of tree
     */
    setBonesHierarchyTree(tree, forceReplace = false) {
        // Assume bones have unique names
        if (this.bonesHierarchyTree && !forceReplace)
            return;
        this.bonesHierarchyTree = tree;
        // Re-init bone rotations
        this._initBoneRotations = {};
        (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.depthFirstSearch)(this.bonesHierarchyTree, (n) => {
            this._initBoneRotations[n.name] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity());
            return false;
        });
        this.initBoneRotations();
    }
    /**
     * All MediaPipe inputs have the following conventions:
     *  - Left-right mirrored (selfie mode)
     *  - Face towards -Z (towards camera) by default
     *  TODO: interpolate results to 60 FPS.
     * @param results Result object from MediaPipe Holistic
     */
    process(results) {
        // console.log("call process()");
        // console.log("results: ", results);
        this.cloneableInputResults = results;
        if (!this.cloneableInputResults)
            return;
        if (this._boneOptions.resetInvisible) {
            this.resetBoneRotations();
        }
        this.preProcessResults();
        // Actual processing
        // Post filtered landmarks
        this.toCloneableLandmarks(this.poseLandmarks, this.cloneablePoseLandmarks);
        this.filterFaceLandmarks();
        this.toCloneableLandmarks(this.leftHandLandmarks, this.cloneableLeftHandLandmarks);
        this.toCloneableLandmarks(this.rightHandLandmarks, this.cloneableRightHandLandmarks);
        // Gather key points
        this.getKeyPoints();
        // Bone Orientations Independent
        // Calculate iris orientations
        this.calcIrisNormal();
        // Bone Orientations Dependent
        // Calculate face orientation
        this.calcFaceBones();
        // Calculate expressions
        this.calcExpressions();
        // Calculate full body bones
        this.calcPoseBones();
        // Calculate hand bones
        this.calcHandBones();
        // Post processing
        if (this._boneOptions.irisLockX) {
            this._boneRotations["iris"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(this._boneRotations["iris"]), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x));
            this._boneRotations["leftIris"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(this._boneRotations["iris"]), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x));
            this._boneRotations["rightIris"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(this._boneRotations["iris"]), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x));
        }
        const lockBones = [];
        // Holistic doesn't reset hand landmarks when invisible
        // So we infer invisibility from wrist landmark
        if (this._boneOptions.resetInvisible) {
            if ((this.cloneableInputResults?.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST].visibility || 0) < _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD) {
                for (const k of Object.keys(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS_BONE_MAPPING)) {
                    const key = `left${k}`;
                    lockBones.push(key);
                }
            }
            if ((this.cloneableInputResults?.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].visibility || 0) < _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD) {
                for (const k of Object.keys(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS_BONE_MAPPING)) {
                    const key = `right${k}`;
                    lockBones.push(key);
                }
            }
        }
        if (this._boneOptions.lockFinger) {
            for (const d of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
                for (const k of Object.keys(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS_BONE_MAPPING)) {
                    const key = d + k;
                    lockBones.push(key);
                }
            }
        }
        if (this._boneOptions.lockArm) {
            for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
                lockBones.push(`${k}UpperArm`);
                lockBones.push(`${k}LowerArm`);
            }
        }
        if (this._boneOptions.lockLeg) {
            for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
                lockBones.push(`${k}UpperLeg`);
                lockBones.push(`${k}LowerLeg`);
                lockBones.push(`${k}Foot`);
            }
        }
        this.filterBoneRotations(lockBones);
        // Push to main
        this.pushBoneRotationBuffer();
    }
    resetBoneRotations(sendResult = false) {
        for (const [k, v] of Object.entries(this._initBoneRotations)) {
            this._boneRotations[k].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(v));
        }
        if (sendResult) {
            this.pushBoneRotationBuffer();
        }
    }
    filterBoneRotations(boneNames) {
        for (const k of boneNames) {
            if (this._boneRotations[k]) {
                this._boneRotations[k].set(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity());
            }
        }
    }
    getKeyPoints() {
        // Get points from face mesh
        this._keyPoints.top_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][0]];
        this._keyPoints.left_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][6]];
        this._keyPoints.bottom_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][18]];
        this._keyPoints.right_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][30]];
        this._keyPoints.left_eye_inner =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][8]];
        this._keyPoints.right_eye_inner =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][8]];
        this._keyPoints.left_eye_outer =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][0]];
        this._keyPoints.right_eye_outer =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][0]];
        this._keyPoints.mouth_left =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][10]];
        this._keyPoints.mouth_right =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][0]];
        this._keyPoints.mouth_top_first =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][24]];
        this._keyPoints.mouth_top_second =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][25]];
        this._keyPoints.mouth_top_third =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][26]];
        this._keyPoints.mouth_bottom_first =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][34]];
        this._keyPoints.mouth_bottom_second =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][35]];
        this._keyPoints.mouth_bottom_third =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][36]];
        this._keyPoints.left_iris_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][1]];
        this._keyPoints.left_iris_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][3]];
        this._keyPoints.left_iris_left =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][2]];
        this._keyPoints.left_iris_right =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][0]];
        this._keyPoints.right_iris_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][1]];
        this._keyPoints.right_iris_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][3]];
        this._keyPoints.right_iris_left =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][2]];
        this._keyPoints.right_iris_right =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][0]];
        this._keyPoints.left_eye_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][12]];
        this._keyPoints.left_eye_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][4]];
        this._keyPoints.left_eye_inner_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][14]];
        this._keyPoints.left_eye_outer_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][10]];
        this._keyPoints.right_eye_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][12]];
        this._keyPoints.right_eye_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][4]];
        this._keyPoints.right_eye_outer_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][10]];
        this._keyPoints.right_eye_inner_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][14]];
    }
    /*
     * Calculate the face orientation from landmarks.
     * Landmarks from Face Mesh takes precedence.
     */
    calcFaceBones() {
        const axisX = this._keyPoints.left_face_oval.pos
            .subtract(this._keyPoints.right_face_oval.pos)
            .normalize();
        const axisY = this._keyPoints.top_face_oval.pos
            .subtract(this._keyPoints.bottom_face_oval.pos)
            .normalize();
        if (axisX.length() === 0 || axisY.length() === 0)
            return;
        const thisBasis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
            axisX,
            axisY,
            _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(axisX, axisY),
        ]);
        // Distribute rotation between neck and head
        const headParentQuaternion = this.applyQuaternionChain("head", false);
        const headBasis = this._boneRotations["head"].rotateBasis(headParentQuaternion);
        const quaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(thisBasis, headBasis, headParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x);
        this._headQuaternion.updateRotation(quaternion);
        const scaledQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.scaleRotation)(this._headQuaternion.rot, 0.5);
        this._boneRotations["head"].set(scaledQuaternion);
        this._boneRotations["neck"].set(scaledQuaternion);
    }
    /*
     * Remap positional offsets to rotations.
     * Iris only have positional offsets. Their normals always face front.
     */
    calcIrisNormal() {
        if (!this.cloneableInputResults?.faceLandmarks)
            return;
        const leftIrisCenter = this._keyPoints.left_iris_top.pos
            .add(this._keyPoints.left_iris_bottom.pos)
            .add(this._keyPoints.left_iris_left.pos)
            .add(this._keyPoints.left_iris_right.pos)
            .scale(0.5);
        const rightIrisCenter = this._keyPoints.right_iris_top.pos
            .add(this._keyPoints.right_iris_bottom.pos)
            .add(this._keyPoints.right_iris_left.pos)
            .add(this._keyPoints.right_iris_right.pos)
            .scale(0.5);
        // Calculate eye center
        const leftEyeCenter = this._keyPoints.left_eye_top.pos
            .add(this._keyPoints.left_eye_bottom.pos)
            .add(this._keyPoints.left_eye_inner_secondary.pos)
            .add(this._keyPoints.left_eye_outer_secondary.pos)
            .scale(0.5);
        const rightEyeCenter = this._keyPoints.right_eye_top.pos
            .add(this._keyPoints.right_eye_bottom.pos)
            .add(this._keyPoints.right_eye_outer_secondary.pos)
            .add(this._keyPoints.right_eye_inner_secondary.pos)
            .scale(0.5);
        // Calculate offsets
        const leftEyeWidth = this._keyPoints.left_eye_inner.pos
            .subtract(this._keyPoints.left_eye_outer.pos)
            .length();
        const rightEyeWidth = this._keyPoints.right_eye_inner.pos
            .subtract(this._keyPoints.right_eye_outer.pos)
            .length();
        const leftIrisOffset = leftIrisCenter
            .subtract(leftEyeCenter)
            .scale(Poses.EYE_WIDTH_BASELINE / leftEyeWidth);
        const rightIrisOffset = rightIrisCenter
            .subtract(rightEyeCenter)
            .scale(Poses.EYE_WIDTH_BASELINE / rightEyeWidth);
        // Remap offsets to quaternions
        const leftIrisRotationYPR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll((0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(leftIrisOffset.x, -Poses.IRIS_MP_X_RANGE, Poses.IRIS_MP_X_RANGE, -Poses.IRIS_BJS_X_RANGE, Poses.IRIS_BJS_X_RANGE), (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(leftIrisOffset.y, -Poses.IRIS_MP_Y_RANGE, Poses.IRIS_MP_Y_RANGE, -Poses.IRIS_BJS_Y_RANGE, Poses.IRIS_BJS_Y_RANGE), 0);
        const rightIrisRotationYPR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll((0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(rightIrisOffset.x, -Poses.IRIS_MP_X_RANGE, Poses.IRIS_MP_X_RANGE, -Poses.IRIS_BJS_X_RANGE, Poses.IRIS_BJS_X_RANGE), (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(rightIrisOffset.y, -Poses.IRIS_MP_Y_RANGE, Poses.IRIS_MP_Y_RANGE, -Poses.IRIS_BJS_Y_RANGE, Poses.IRIS_BJS_Y_RANGE), 0);
        this._boneRotations["leftIris"].set(leftIrisRotationYPR);
        this._boneRotations["rightIris"].set(rightIrisRotationYPR);
        this._boneRotations["iris"].set(this.lRLinkQuaternion(leftIrisRotationYPR, rightIrisRotationYPR));
    }
    calcExpressions() {
        if (!this.cloneableInputResults?.faceLandmarks)
            return;
        const leftTopToMiddle = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.pointLineDistance)(this._keyPoints.left_eye_top.pos, this._keyPoints.left_eye_inner.pos, this._keyPoints.left_eye_outer.pos);
        const leftTopToBottom = this._keyPoints.left_eye_top.pos
            .subtract(this._keyPoints.left_eye_bottom.pos)
            .length();
        const rightTopToMiddle = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.pointLineDistance)(this._keyPoints.right_eye_top.pos, this._keyPoints.right_eye_inner.pos, this._keyPoints.right_eye_outer.pos);
        const rightTopToBottom = this._keyPoints.right_eye_top.pos
            .subtract(this._keyPoints.right_eye_bottom.pos)
            .length();
        this._blinkBase.updatePosition(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(Math.log(leftTopToMiddle / leftTopToBottom + 1), Math.log(rightTopToMiddle / rightTopToBottom + 1), 0));
        let leftRangeOffset = 0;
        if (this._leftBlinkArr.length() > 4) {
            leftRangeOffset =
                this._leftBlinkArr.values.reduce((p, c, i) => p + (c - p) / (i + 1), 0) - Poses.BLINK_RATIO_LOW;
        }
        const leftBlink = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeNoCap)(this._blinkBase.pos.x, Poses.BLINK_RATIO_LOW + leftRangeOffset, Poses.BLINK_RATIO_HIGH + leftRangeOffset, 0, 1);
        this._leftBlinkArr.push(this._blinkBase.pos.x);
        let rightRangeOffset = 0;
        if (this._rightBlinkArr.length() > 4) {
            rightRangeOffset =
                this._rightBlinkArr.values.reduce((p, c, i) => p + (c - p) / (i + 1), 0) - Poses.BLINK_RATIO_LOW;
        }
        const rightBlink = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeNoCap)(this._blinkBase.pos.y, Poses.BLINK_RATIO_LOW + rightRangeOffset, Poses.BLINK_RATIO_HIGH + rightRangeOffset, 0, 1);
        this._rightBlinkArr.push(this._blinkBase.pos.y);
        const blink = this.lRLink(leftBlink, rightBlink);
        this._boneRotations["blink"].set(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion(leftBlink, rightBlink, blink, 0));
        const mouthWidth = this._keyPoints.mouth_left.pos
            .subtract(this._keyPoints.mouth_right.pos)
            .length();
        const mouthRange1 = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)((this._keyPoints.mouth_top_first.pos
            .subtract(this._keyPoints.mouth_bottom_first.pos)
            .length() *
            Poses.MOUTH_WIDTH_BASELINE) /
            mouthWidth, Poses.MOUTH_MP_RANGE_LOW, Poses.MOUTH_MP_RANGE_HIGH, 0, 1);
        const mouthRange2 = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)((this._keyPoints.mouth_top_second.pos
            .subtract(this._keyPoints.mouth_bottom_second.pos)
            .length() *
            Poses.MOUTH_WIDTH_BASELINE) /
            mouthWidth, Poses.MOUTH_MP_RANGE_LOW, Poses.MOUTH_MP_RANGE_HIGH, 0, 1);
        const mouthRange3 = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)((this._keyPoints.mouth_top_third.pos
            .subtract(this._keyPoints.mouth_bottom_third.pos)
            .length() *
            Poses.MOUTH_WIDTH_BASELINE) /
            mouthWidth, Poses.MOUTH_MP_RANGE_LOW, Poses.MOUTH_MP_RANGE_HIGH, 0, 1);
        this._boneRotations["mouth"].set(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion((mouthRange1 + mouthRange2 + mouthRange3) / 3, 0, 0, 0));
    }
    calcPoseBones() {
        // Do not calculate pose if no visible face. It can lead to wierd poses.
        if (!this.cloneableInputResults?.poseLandmarks)
            return;
        // Use hips as the starting point. Rotation of hips is always on XZ plane.
        // Upper chest is not used.
        // TODO derive neck and chest from spine and head.
        const leftHip = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_HIP].pos;
        const rightHip = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_HIP].pos;
        const leftShoulder = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_SHOULDER].pos;
        const rightShoulder = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_SHOULDER].pos;
        this.poseNormals.length = 0;
        // Hips
        const worldXZPlane = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0));
        const hipLine = leftHip.subtract(rightHip);
        const hipLineProj = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(worldXZPlane, hipLine);
        const hipRotationAngle = Math.atan2(hipLineProj.z, hipLineProj.x);
        this._boneRotations["hips"].set(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, hipRotationAngle, 0));
        // Chest/Shoulder
        const shoulderNormR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPoints(rightShoulder, leftShoulder, rightHip).normal;
        const shoulderNormL = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPoints(rightShoulder, leftShoulder, leftHip).normal;
        const shoulderNormal = shoulderNormL.add(shoulderNormR).normalize();
        // Spine
        if (shoulderNormal.length() > 0.1) {
            const spineParentQuaternion = this.applyQuaternionChain("spine", false);
            const spineBasis = this._boneRotations["spine"].rotateBasis(spineParentQuaternion);
            const newSpineBasisY = rightShoulder
                .subtract(leftShoulder)
                .normalize();
            const newSpineBasis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                shoulderNormal,
                newSpineBasisY,
                _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(shoulderNormal, newSpineBasisY),
            ]);
            this._boneRotations["spine"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(spineBasis, newSpineBasis, spineParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
        }
        this.calcWristBones();
        // Arms
        let theta = 0, phi = 0;
        for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
            const isLeft = k === "left";
            if (!this.shallUpdateArm(isLeft))
                continue;
            const upperArmKey = `${k}UpperArm`;
            const shoulderLandmark = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS[`${k.toUpperCase()}_SHOULDER`]].pos;
            const elbowLandmark = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS[`${k.toUpperCase()}_ELBOW`]].pos;
            const wristLandmark = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS[`${k.toUpperCase()}_WRIST`]].pos;
            const upperArmDir = elbowLandmark
                .subtract(shoulderLandmark)
                .normalize();
            const upperArmParentQuaternion = this.applyQuaternionChain(upperArmKey, false);
            const upperArmBasis = this._boneRotations[upperArmKey].rotateBasis(upperArmParentQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(upperArmDir, upperArmBasis);
            this._boneRotations[upperArmKey].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(upperArmBasis, theta, phi, upperArmParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
            // Rotate lower arms around X axis together with hands.
            // This is a combination of spherical coordinates rotation and rotation between bases.
            const handNormal = isLeft
                ? this.leftHandNormal
                : this.rightHandNormal;
            const lowerArmKey = `${k}LowerArm`;
            const lowerArmDir = wristLandmark
                .subtract(elbowLandmark)
                .normalize();
            const lowerArmPrevQuaternion = this.applyQuaternionChain(lowerArmKey, false);
            const lowerArmBasis = this._boneRotations[lowerArmKey].rotateBasis(lowerArmPrevQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(lowerArmDir, lowerArmBasis);
            const handNormalsKey = `${k}HandNormals`;
            const handNormals = this[handNormalsKey];
            handNormals.length = 0;
            const firstQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(lowerArmBasis, theta, phi, lowerArmPrevQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            const finalQuaternion = this.applyXRotationWithChild(lowerArmKey, lowerArmPrevQuaternion, firstQuaternion, handNormal, lowerArmBasis);
            this._boneRotations[lowerArmKey].set(finalQuaternion);
        }
        // Update rotations on wrists
        this.calcWristBones(false);
        // Legs and feet
        for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
            const isLeft = k === "left";
            if (!this.shallUpdateLegs(isLeft))
                continue;
            const thisLandmarks = isLeft
                ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT
                : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT;
            const upperLegKey = `${k}UpperLeg`;
            const lowerLegKey = `${k}LowerLeg`;
            const hipLandmark = this.worldPoseLandmarks[thisLandmarks[`${k.toUpperCase()}_HIP`]].pos;
            const kneeLandmark = this.worldPoseLandmarks[thisLandmarks[`${k.toUpperCase()}_KNEE`]].pos;
            const ankleLandmark = this.worldPoseLandmarks[thisLandmarks[`${k.toUpperCase()}_ANKLE`]].pos;
            const upperLegDir = kneeLandmark.subtract(hipLandmark).normalize();
            const upperLegParentQuaternion = this.applyQuaternionChain(upperLegKey, false);
            const upperLegBasis = this._boneRotations[upperLegKey].rotateBasis(upperLegParentQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(upperLegDir, upperLegBasis);
            this._boneRotations[upperLegKey].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(upperLegBasis, theta, phi, upperLegParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
            const lowerLegDir = ankleLandmark
                .subtract(kneeLandmark)
                .normalize();
            const lowerLegPrevQuaternion = this.applyQuaternionChain(lowerLegKey, false);
            const lowerLegBasis = this._boneRotations[lowerLegKey].rotateBasis(lowerLegPrevQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(lowerLegDir, lowerLegBasis);
            const firstQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(lowerLegBasis, theta, phi, lowerLegPrevQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            this._boneRotations[lowerLegKey].set(firstQuaternion);
        }
        this.calcFeetBones(false);
    }
    /**
     * thisKey: key in _boneRotations
     * prevQuaternion: Parent cumulated rotation quaternion
     * firstQuaternion: Rotation quaternion calculated without applying X rotation
     * normal: A normal pointing to local -y
     * thisBasis: basis on this node after prevQuaternion is applied
     */
    applyXRotationWithChild(thisKey, prevQuaternion, firstQuaternion, normal, thisBasis) {
        const thisRotatedBasis = this._boneRotations[thisKey].rotateBasis(prevQuaternion.multiply((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(firstQuaternion, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz)));
        const thisYZPlane = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), thisRotatedBasis.x.clone());
        const projectedNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(thisYZPlane, normal).rotateByQuaternionToRef(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisRotatedBasis.x.clone(), thisRotatedBasis.y.clone(), thisRotatedBasis.z.clone())), projectedNormal);
        const projectedPrevZ = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(thisYZPlane, thisRotatedBasis.z.negate()).rotateByQuaternionToRef(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisRotatedBasis.x.clone(), thisRotatedBasis.y.clone(), thisRotatedBasis.z.clone())), projectedPrevZ);
        projectedPrevZ.normalize();
        let xPrev = Math.atan2(projectedPrevZ.y, -projectedPrevZ.z);
        let xAngle = Math.atan2(projectedNormal.y, -projectedNormal.z);
        if (xAngle > 0)
            xAngle -= Math.PI * 2;
        if (xAngle < -Math.PI * 1.25)
            xAngle = xPrev;
        // if (isLeg) {
        //     if (Math.abs(xAngle) > Math.PI * 0.2778 && Math.abs(xAngle) < Math.PI / 2) {
        //         xAngle -= Math.PI * 0.2778;
        //     } else {
        //         xAngle = xPrev;
        //     }
        // }
        const thisXRotatedBasis = thisRotatedBasis.rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(thisRotatedBasis.x.clone(), (xAngle - xPrev) * 0.5));
        // The quaternion needs to be calculated in local coordinate system
        const secondQuaternion = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(thisBasis, thisXRotatedBasis, prevQuaternion);
        const finalQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(secondQuaternion, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
        return finalQuaternion;
    }
    calcWristBones(firstPass = true) {
        const hands = {
            left: this.leftHandLandmarks,
            right: this.rightHandLandmarks,
        };
        for (const [k, v] of Object.entries(hands)) {
            const isLeft = k === "left";
            const wristVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
                ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST
                : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].visibility || 0;
            if (wristVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD)
                continue;
            const vertices = [
                [
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.PINKY_MCP],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.INDEX_FINGER_MCP],
                ],
                [
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.RING_FINGER_MCP],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.INDEX_FINGER_MCP],
                ],
                [
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.PINKY_MCP],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.MIDDLE_FINGER_MCP],
                ],
            ];
            // Root normal
            const handNormal = isLeft
                ? this.leftHandNormal
                : this.rightHandNormal;
            const rootNormal = vertices
                .reduce((prev, curr) => {
                const _normal = Poses.normalFromVertices(curr, isLeft);
                // handNormals.push(vectorToNormalizedLandmark(_normal));
                return prev.add(_normal);
            }, _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero())
                .normalize();
            handNormal.copyFrom(rootNormal);
            // handNormals.push(vectorToNormalizedLandmark(rootNormal));
            const thisWristRotation = this._boneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST, isLeft)];
            const basis1 = thisWristRotation.baseBasis;
            // Project palm landmarks to average plane
            const projectedLandmarks = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.calcAvgPlane)([
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.INDEX_FINGER_MCP].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.MIDDLE_FINGER_MCP].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.RING_FINGER_MCP].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.PINKY_MCP].pos,
            ], rootNormal);
            const basis2 = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                projectedLandmarks[0],
                projectedLandmarks[1],
                projectedLandmarks[4],
            ]).rotateByQuaternion(this.applyQuaternionChain(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST, isLeft).conjugate());
            const wristRotationQuaternionRaw = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(basis1, basis2);
            const wristRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(wristRotationQuaternionRaw, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            if (!firstPass)
                thisWristRotation.set(wristRotationQuaternion);
        }
    }
    calcHandBones() {
        // Right hand shall have local x reversed?
        const hands = {
            left: this.leftHandLandmarks,
            right: this.rightHandLandmarks,
        };
        for (const [k, v] of Object.entries(hands)) {
            const isLeft = k === "left";
            for (let i = 1; i < _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH; ++i) {
                if (i % 4 === 0)
                    continue;
                const thisHandRotation = this._boneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)];
                const thisLandmark = v[i].pos.clone();
                const nextLandmark = v[i + 1].pos.clone();
                let thisDir = nextLandmark.subtract(thisLandmark).normalize();
                const prevQuaternion = this.applyQuaternionChain(i, isLeft);
                const thisBasis = thisHandRotation.rotateBasis(prevQuaternion);
                // Project landmark to XZ plane for second and third segments
                if (i % 4 === 2 || i % 4 === 3) {
                    const projPlane = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), thisBasis.y.clone());
                    thisDir = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(projPlane, thisDir);
                }
                let [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(thisDir, thisBasis);
                // Need to use original Basis, because the quaternion from
                // RotationAxis inherently uses local coordinate system.
                let thisRotationQuaternion;
                const lrCoeff = isLeft ? -1 : 1;
                // Thumb rotations are y main. Others are z main.
                const removeAxis = i % 4 === 1
                    ? i < 4
                        ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.none
                        : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x
                    : i < 4
                        ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.xz
                        : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.xy;
                const firstCapAxis = i < 4 ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.z : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.y;
                const secondCapAxis = i < 4 ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.y : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.z;
                const secondCap = i < 2 ? 15 : 110;
                thisRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(thisBasis, theta, phi, prevQuaternion), removeAxis, firstCapAxis, -15, 15, secondCapAxis, lrCoeff * -15, lrCoeff * secondCap);
                thisRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(thisRotationQuaternion, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
                thisHandRotation.set(thisRotationQuaternion);
            }
        }
    }
    calcFeetBones(firstPass = true) {
        for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
            const isLeft = k === "left";
            if (!this.shallUpdateLegs(isLeft))
                continue;
            const landmarkBasis = isLeft
                ? (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_HEEL]
                        .pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_FOOT_INDEX].pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_ANKLE]
                        .pos,
                ])
                : (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_HEEL]
                        .pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_FOOT_INDEX].pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_ANKLE]
                        .pos,
                ]);
            const footBoneKey = `${k}Foot`;
            const thisBasis = landmarkBasis
                .negateAxes(_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz)
                .transpose([1, 2, 0]);
            thisBasis.verifyBasis();
            // Root normal
            const footNormal = isLeft
                ? this.leftFootNormal
                : this.rightFootNormal;
            footNormal.copyFrom(thisBasis.z.negate());
            const thisFootRotation = this._boneRotations[footBoneKey];
            const basis1 = thisFootRotation.baseBasis;
            const basis2 = thisBasis.rotateByQuaternion(this.applyQuaternionChain(footBoneKey, isLeft).conjugate());
            const footRotationQuaternionRaw = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(basis1, basis2);
            const footRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(footRotationQuaternionRaw, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            if (!firstPass)
                thisFootRotation.set(footRotationQuaternion);
        }
    }
    preProcessResults() {
        // Preprocessing results
        // Create pose landmark list
        // @ts-ignore
        const inputWorldPoseLandmarks = 
        //* TODO: Patched.
        //* https://stackoverflow.com/questions/18083389/ignore-typescript-errors-property-does-not-exist-on-value-of-type
        // this.cloneableInputResults?.ea; // Seems to be the new pose_world_landmark
        this.cloneableInputResults?.ea; // Seems to be the new pose_world_landmark
        const inputPoseLandmarks = this.cloneableInputResults?.poseLandmarks; // Seems to be the new pose_world_landmark
        if (inputWorldPoseLandmarks && inputPoseLandmarks) {
            if (inputWorldPoseLandmarks.length !== _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH)
                console.warn(`Pose Landmark list has a length less than ${_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH}!`);
            this.inputPoseLandmarks = this.preProcessLandmarks(inputWorldPoseLandmarks, this.worldPoseLandmarks);
            this.preProcessLandmarks(inputPoseLandmarks, this.poseLandmarks);
            // Positional offset
            if ((inputWorldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_HIP].visibility ||
                0) > _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD &&
                (inputWorldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_HIP].visibility ||
                    0) > _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD) {
                const midHipPos = (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.vectorToNormalizedLandmark)(this.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_HIP].pos
                    .add(this.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_HIP].pos)
                    .scaleInPlace(0.5));
                midHipPos.z = 0; // No depth info
                if (!this.midHipInitOffset) {
                    this.midHipInitOffset = midHipPos;
                    Object.freeze(this.midHipInitOffset);
                }
                this.midHipOffset.updatePosition(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(midHipPos.x - this.midHipInitOffset.x, midHipPos.y - this.midHipInitOffset.y, midHipPos.z - this.midHipInitOffset.z));
                // TODO: delta_x instead of x
                this.midHipPos = (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.vectorToNormalizedLandmark)(this.midHipOffset.pos);
            }
        }
        const inputFaceLandmarks = this.cloneableInputResults?.faceLandmarks; // Seems to be the new pose_world_landmark
        if (inputFaceLandmarks) {
            this.inputFaceLandmarks = this.preProcessLandmarks(inputFaceLandmarks, this.faceLandmarks);
        }
        // TODO: update wrist offset only when debugging
        const inputLeftHandLandmarks = this.cloneableInputResults?.leftHandLandmarks;
        const inputRightHandLandmarks = this.cloneableInputResults?.rightHandLandmarks;
        if (inputLeftHandLandmarks) {
            this.leftWristOffset.updatePosition(this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST].pos.subtract((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(inputLeftHandLandmarks[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST], Poses.HAND_POSITION_SCALING, true)));
            this.inputLeftHandLandmarks = this.preProcessLandmarks(inputLeftHandLandmarks, this.leftHandLandmarks, this.leftWristOffset.pos, Poses.HAND_POSITION_SCALING);
        }
        if (inputRightHandLandmarks) {
            this.rightWristOffset.updatePosition(this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].pos.subtract((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(inputRightHandLandmarks[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST], Poses.HAND_POSITION_SCALING, true)));
            this.inputRightHandLandmarks = this.preProcessLandmarks(inputRightHandLandmarks, this.rightHandLandmarks, this.rightWristOffset.pos, Poses.HAND_POSITION_SCALING);
        }
    }
    preProcessLandmarks(resultsLandmarks, filteredLandmarks, offset = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), scaling = 1) {
        // Reverse Y-axis. Input results use canvas coordinate system.
        resultsLandmarks.map((v) => {
            v.x = v.x * scaling + offset.x;
            v.y = -v.y * scaling + offset.y;
            v.z = v.z * scaling + offset.z;
        });
        // Noise filtering
        for (let i = 0; i < resultsLandmarks.length; ++i) {
            filteredLandmarks[i].updatePosition((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(resultsLandmarks[i]), resultsLandmarks[i].visibility);
        }
        return resultsLandmarks;
    }
    toCloneableLandmarks(landmarks, cloneableLandmarks) {
        cloneableLandmarks.forEach((v, idx) => {
            v.x = landmarks[idx].pos.x;
            v.y = landmarks[idx].pos.y;
            v.z = landmarks[idx].pos.z;
            v.visibility = landmarks[idx].visibility;
        });
    }
    filterFaceLandmarks() {
        // Unpack face mesh landmarks
        this._faceMeshLandmarkIndexList.length = 0;
        this._faceMeshLandmarkList.length = 0;
        for (let i = 0; i < Poses.FACE_MESH_CONNECTIONS.length; ++i) {
            const arr = [];
            const idx = new Set();
            Poses.FACE_MESH_CONNECTIONS[i].forEach((v) => {
                idx.add(v[0]);
                idx.add(v[1]);
            });
            const idxArr = Array.from(idx);
            this._faceMeshLandmarkIndexList.push(idxArr);
            for (let j = 0; j < idxArr.length; j++) {
                arr.push({
                    x: this.faceLandmarks[idxArr[j]].pos.x,
                    y: this.faceLandmarks[idxArr[j]].pos.y,
                    z: this.faceLandmarks[idxArr[j]].pos.x,
                    visibility: this.faceLandmarks[idxArr[j]].visibility,
                });
            }
            this._faceMeshLandmarkList.push(arr);
        }
    }
    lRLinkWeights() {
        const faceCameraAngle = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.degreeBetweenVectors)((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(this.faceNormal), new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1), true);
        const weightLeft = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(faceCameraAngle.y, Poses.LR_FACE_DIRECTION_RANGE, -Poses.LR_FACE_DIRECTION_RANGE, 0, 1);
        const weightRight = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(faceCameraAngle.y, -Poses.LR_FACE_DIRECTION_RANGE, Poses.LR_FACE_DIRECTION_RANGE, 0, 1);
        return { weightLeft, weightRight };
    }
    lRLink(l, r) {
        const { weightLeft, weightRight } = this.lRLinkWeights();
        return weightLeft * l + weightRight * r;
    }
    lRLinkVector(l, r) {
        const { weightLeft, weightRight } = this.lRLinkWeights();
        return l.scale(weightLeft).addInPlace(r.scale(weightRight));
    }
    lRLinkQuaternion(l, r) {
        const { weightLeft, weightRight } = this.lRLinkWeights();
        return l.scale(weightLeft).addInPlace(r.scale(weightRight));
    }
    initHandBoneRotations(isLeft) {
        // TODO: adjust bases
        // Wrist's basis is used for calculating quaternion between two Cartesian coordinate systems directly
        // All others' are used for rotating planes of a Spherical coordinate system at the node
        this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST, isLeft)] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), isLeft
            ? (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 1),
            ])
            : new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-0.9327159079568041, 0.12282522615654383, -0.3390501421086685).normalize(),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-0.010002212677077182, 0.0024727643453822945, 0.028411551927747327).normalize(),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0.14320801411112857, 0.9890497926949048, -0.03566472016590984).normalize(),
            ]));
        // Thumb
        // THUMB_CMC
        // THUMB_MCP
        // THUMB_IP
        for (let i = 1; i < 4; ++i) {
            const tMCP_X = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, -1.5).normalize();
            const tMCP_Y = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, isLeft ? -1 : 1, 0);
            const tMCP_Z = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(tMCP_X, tMCP_Y).normalize();
            const basis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                tMCP_X,
                // new Vector3(0, 0, isLeft ? -1 : 1),
                tMCP_Y,
                tMCP_Z,
            ]).rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? 0.2 : -0.2));
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), basis);
        }
        // Index
        for (let i = 5; i < 8; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
        // Middle
        for (let i = 9; i < 12; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
        // Ring
        for (let i = 13; i < 16; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
        // Pinky
        for (let i = 17; i < 20; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
    }
    initBoneRotations() {
        // Hand bones
        this.initHandBoneRotations(true);
        this.initHandBoneRotations(false);
        // Pose bones
        this._initBoneRotations["head"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["neck"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["hips"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
        ]));
        this._initBoneRotations["spine"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
        ]));
        const lr = ["left", "right"];
        // Arms
        for (const k of lr) {
            const isLeft = k === "left";
            this._initBoneRotations[`${k}UpperArm`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? 1.0472 : -1.0472), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
            ]));
            this._initBoneRotations[`${k}LowerArm`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
            ]));
        }
        // Legs
        for (const k of lr) {
            const isLeft = k === "left";
            this._initBoneRotations[`${k}UpperLeg`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            ]).rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? -0.05236 : 0.05236)));
            this._initBoneRotations[`${k}LowerLeg`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            ]).rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? -0.0873 : 0.0873)));
        }
        // Feet
        for (const k of lr) {
            const isLeft = k === "left";
            const startBasis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            ]);
            // const rX = Quaternion.RotationAxis(startBasis.x.clone(), isLeft ? 0.2618 : -0.2618);
            // const z1 = Vector3.Zero();
            // startBasis.z.rotateByQuaternionToRef(rX, z1);
            // const rZ = Quaternion.RotationAxis(z1, isLeft ? 0.0873 : -0.0873);
            // const thisFootBasisRotation = isLeft ? this.leftFootBasisRotation : this.rightFootBasisRotation;
            // thisFootBasisRotation.copyFrom(rX.multiply(rZ));
            this._initBoneRotations[`${k}Foot`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), startBasis);
        }
        // Expressions
        this._initBoneRotations["mouth"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["blink"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["leftIris"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["rightIris"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["iris"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        // Freeze init object
        Object.freeze(this._initBoneRotations);
        // Deep copy to actual map
        for (const [k, v] of Object.entries(this._initBoneRotations)) {
            this._boneRotations[k] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(v), v.baseBasis);
        }
    }
    static normalFromVertices(vertices, reverse) {
        if (reverse)
            vertices.reverse();
        const vec = [];
        for (let i = 0; i < 2; ++i) {
            vec.push(vertices[i + 1].pos.subtract(vertices[i].pos));
        }
        return vec[0].cross(vec[1]).normalize();
    }
    // Recursively apply previous quaternions to current basis
    applyQuaternionChain(startLandmark, isLeft) {
        const q = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        const rotations = [];
        let [startNode, parentMap] = (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.depthFirstSearch)(this.bonesHierarchyTree, (n) => {
            const targetName = Number.isFinite(startLandmark)
                ? (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(startLandmark, isLeft)
                : startLandmark;
            return n.name === targetName;
        });
        while (parentMap.has(startNode)) {
            startNode = parentMap.get(startNode);
            const boneQuaternion = this._boneRotations[startNode.name];
            rotations.push((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(boneQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
        }
        // Quaternions need to be applied from parent to children
        rotations.reverse().map((tq) => {
            q.multiplyInPlace(tq);
        });
        q.normalize();
        return q;
    }
    shallUpdateArm(isLeft) {
        // Update only when all leg landmarks are visible
        const shoulderVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_SHOULDER
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_SHOULDER].visibility || 0;
        const wristVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].visibility || 0;
        return !(shoulderVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            wristVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD);
    }
    shallUpdateLegs(isLeft) {
        // Update only when all leg landmarks are visible
        const kneeVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_KNEE
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_KNEE].visibility || 0;
        const ankleVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_ANKLE
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_ANKLE].visibility || 0;
        const footVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_FOOT_INDEX
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_FOOT_INDEX].visibility || 0;
        const heelVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_HEEL
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_HEEL].visibility || 0;
        return !(kneeVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            ankleVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            footVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            heelVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD);
    }
    pushBoneRotationBuffer() {
        if (!this._boneRotationUpdateFn)
            return;
        // Callback
        const jsonStr = JSON.stringify(this._boneRotations);
        const arrayBuffer = this.textEncoder.encode(jsonStr);
        this._boneRotationUpdateFn(comlink__WEBPACK_IMPORTED_MODULE_7__.transfer(arrayBuffer, [arrayBuffer.buffer]));
    }
}
Poses.FACE_MESH_CONNECTIONS = [
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LEFT_EYEBROW,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_RIGHT_EYEBROW,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LEFT_EYE,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_RIGHT_EYE,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LEFT_IRIS,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_RIGHT_IRIS,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LIPS,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_FACE_OVAL,
];
Poses.HAND_BASE_ROOT_NORMAL = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0);
Poses.HAND_POSITION_SCALING = 0.8;
/* Remap offsets to quaternions using arbitrary range.
 * IRIS_MP=MediaPipe Iris
 * IRIS_BJS=BabylonJS RotationYawPitchRoll
 */
Poses.IRIS_MP_X_RANGE = 0.027;
Poses.IRIS_MP_Y_RANGE = 0.011;
Poses.IRIS_BJS_X_RANGE = 0.28;
Poses.IRIS_BJS_Y_RANGE = 0.12;
Poses.BLINK_RATIO_LOW = 0.59;
Poses.BLINK_RATIO_HIGH = 0.61;
Poses.MOUTH_MP_RANGE_LOW = 0.001;
Poses.MOUTH_MP_RANGE_HIGH = 0.06;
Poses.EYE_WIDTH_BASELINE = 0.0546;
Poses.MOUTH_WIDTH_BASELINE = 0.095;
Poses.LR_FACE_DIRECTION_RANGE = 27;
const poseWrapper = {
    poses: Poses,
};
comlink__WEBPACK_IMPORTED_MODULE_7__.expose(poseWrapper);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Poses);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_mediapipe_holistic_holistic_js-node_modules_kalmanjs_lib_kalman_js-node_-164f9b"], () => (__webpack_require__("./src/worker/pose-processing.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".test.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_worker_pose-processing_ts": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkv3d_web"] = self["webpackChunkv3d_web"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_mediapipe_holistic_holistic_js-node_modules_kalmanjs_lib_kalman_js-node_-164f9b").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcl9wb3NlLXByb2Nlc3NpbmdfdHMudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILHlCQUF5QjtBQUM0QztBQUNWO0FBQ1o7QUFJeEMsTUFBTSxLQUFLO0lBU2QsSUFBSSxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsWUFDSSxHQUF1QixFQUNOLGFBQWEsSUFBSSxFQUMxQixNQUFNLElBQUk7UUFERCxlQUFVLEdBQVYsVUFBVSxDQUFPO1FBQzFCLFFBQUcsR0FBSCxHQUFHLENBQU87UUFqQkwsVUFBSyxHQUFhLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBbUIvRCxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxvREFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFTSxHQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTyxHQUFHLENBQUMsR0FB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R0FBRyxDQUFDLENBQUM7WUFDYixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxHQUFHO1lBQ1QsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWO1lBQ0ksTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDcEM7SUFDRCxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1FBQzNFLFFBQVEsUUFBZ0IsRUFBRTtZQUN0QixLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsZ0RBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDakQsTUFBTTtZQUNWLEtBQUssSUFBSSxDQUFDLENB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LElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYztZQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO1lBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFOUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxD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eUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7Ozs7O1dDUkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDZkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGFBQWE7V0FDYjtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7Ozs7O1dDcENBO1dBQ0E7V0FDQTtXQUNBOzs7OztVRUhBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci9iYXNpcy50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci9maWx0ZXIudHMiLCJ3ZWJwYWNrOi8vdjNkLXdlYi8uL3NyYy9oZWxwZXIvbGFuZG1hcmsudHMiLCJ3ZWJwYWNrOi8vdjNkLXdlYi8uL3NyYy9oZWxwZXIvcXVhdGVybmlvbi50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci91dGlscy50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL3dvcmtlci9wb3NlLXByb2Nlc3NpbmcudHMiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9pbXBvcnRTY3JpcHRzIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvc3RhcnR1cCBjaHVuayBkZXBlbmRlbmNpZXMiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInYzZC13ZWJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1widjNkLXdlYlwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKlxuQ29weXJpZ2h0IChDKSAyMDIyICBUaGUgdjNkIEF1dGhvcnMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIHZlcnNpb24gMy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8vIENhbGN1bGF0ZSAzRCByb3RhdGlvbnNcbmltcG9ydCB7TnVsbGFibGUsIFBsYW5lLCBRdWF0ZXJuaW9uLCBWZWN0b3IzfSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5pbXBvcnQge0FYSVMsIHZlY3RvcnNTYW1lRGlyV2l0aGluRXBzfSBmcm9tIFwiLi9xdWF0ZXJuaW9uXCI7XG5pbXBvcnQge3NldEVxdWFsLCB2YWxpZFZlY3RvcjN9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIFZlY3RvcjMzID0gW1ZlY3RvcjMsIFZlY3RvcjMsIFZlY3RvcjNdO1xuXG5leHBvcnQgY2xhc3MgQmFzaXMge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IE9SSUdJTkFMX0NBUlRFU0lBTl9CQVNJU19WRUNUT1JTOiBWZWN0b3IzMyA9IFtcbiAgICAgICAgbmV3IFZlY3RvcjMoMSwgMCwgMCksXG4gICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAxKSxcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZGF0YTogVmVjdG9yMzMgPSBCYXNpcy5nZXRPcmlnaW5hbENvb3JkVmVjdG9ycygpO1xuXG4gICAgZ2V0IHgoKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhWzBdO1xuICAgIH1cblxuICAgIGdldCB5KCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVsxXTtcbiAgICB9XG5cbiAgICBnZXQgeigpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbMl07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHYzMzogTnVsbGFibGU8VmVjdG9yMzM+LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGxlZnRIYW5kZWQgPSB0cnVlLFxuICAgICAgICBwcml2YXRlIGVwcyA9IDFlLTZcbiAgICApIHtcbiAgICAgICAgaWYgKHYzMyAmJiB2MzMuZXZlcnkoKHYpID0+IHZhbGlkVmVjdG9yMyh2KSkpXG4gICAgICAgICAgICB0aGlzLnNldCh2MzMpO1xuICAgICAgICB0aGlzLl9kYXRhLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUodik7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXQodjMzOiBWZWN0b3IzMykge1xuICAgICAgICB0aGlzLnguY29weUZyb20odjMzWzBdKTtcbiAgICAgICAgdGhpcy55LmNvcHlGcm9tKHYzM1sxXSk7XG4gICAgICAgIHRoaXMuei5jb3B5RnJvbSh2MzNbMl0pO1xuXG4gICAgICAgIHRoaXMudmVyaWZ5QmFzaXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyaWZ5QmFzaXMoKSB7XG4gICAgICAgIGNvbnN0IHogPSB0aGlzLmxlZnRIYW5kZWQgPyB0aGlzLnogOiB0aGlzLnoubmVnYXRlKCk7XG4gICAgICAgIGlmICghdmVjdG9yc1NhbWVEaXJXaXRoaW5FcHModGhpcy54LmNyb3NzKHRoaXMueSksIHosIHRoaXMuZXBzKSlcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiQmFzaXMgaXMgbm90IGNvcnJlY3QhXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyByb3RhdGVCeVF1YXRlcm5pb24ocTogUXVhdGVybmlvbik6IEJhc2lzIHtcbiAgICAgICAgY29uc3QgbmV3QmFzaXNWZWN0b3JzOiBWZWN0b3IzMyA9IFtWZWN0b3IzLlplcm8oKSwgVmVjdG9yMy5aZXJvKCksIFZlY3RvcjMuWmVybygpXTtcbiAgICAgICAgdGhpcy5fZGF0YS5tYXAoKHYsIGkpID0+IHtcbiAgICAgICAgICAgIHYucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYocSwgbmV3QmFzaXNWZWN0b3JzW2ldKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgQmFzaXMobmV3QmFzaXNWZWN0b3JzKTtcbiAgICB9XG5cbiAgICAvLyBCYXNpcyB2YWxpZGl0eSBpcyBub3QgY2hlY2tlZCFcbiAgICBwdWJsaWMgbmVnYXRlQXhlcyhheGlzOiBBWElTKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnguY2xvbmUoKTtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueS5jbG9uZSgpO1xuICAgICAgICBjb25zdCB6ID0gdGhpcy56LmNsb25lKCk7XG4gICAgICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgICAgICAgY2FzZSBBWElTLng6XG4gICAgICAgICAgICAgICAgeC5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgICAgICB5Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgICAgIHoubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBWElTLnh5OlxuICAgICAgICAgICAgICAgIHgubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIHkubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBWElTLnl6OlxuICAgICAgICAgICAgICAgIHkubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIHoubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBWElTLnh6OlxuICAgICAgICAgICAgICAgIHgubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIHoubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBWElTLnh5ejpcbiAgICAgICAgICAgICAgICB4Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB5Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGF4aXMhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpcyhbeCwgeSwgel0pO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc3Bvc2Uob3JkZXI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xuICAgICAgICAvLyBTYW5pdHkgY2hlY2tcbiAgICAgICAgaWYgKCFzZXRFcXVhbDxudW1iZXI+KG5ldyBTZXQob3JkZXIpLCBuZXcgU2V0KFswLCAxLCAyXSkpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFzaXMgdHJhbnNwb3NlIGZhaWxlZDogd3JvbmcgaW5wdXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gW3RoaXMueC5jbG9uZSgpLCB0aGlzLnkuY2xvbmUoKSwgdGhpcy56LmNsb25lKCldO1xuICAgICAgICBjb25zdCBuZXdEYXRhID0gb3JkZXIubWFwKGkgPT4gZGF0YVtpXSkgYXMgVmVjdG9yMzM7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpcyhuZXdEYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRPcmlnaW5hbENvb3JkVmVjdG9ycygpOiBWZWN0b3IzMyB7XG4gICAgICAgIHJldHVybiBCYXNpcy5PUklHSU5BTF9DQVJURVNJQU5fQkFTSVNfVkVDVE9SUy5tYXAodiA9PiB2LmNsb25lKCkpIGFzIFZlY3RvcjMzO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgYmFzaXMxOiBCYXNpcyxcbiAgICBiYXNpczI6IEJhc2lzLFxuICAgIHByZXZRdWF0ZXJuaW9uPzogUXVhdGVybmlvblxuKSB7XG4gICAgbGV0IHRoaXNCYXNpczEgPSBiYXNpczEsIHRoaXNCYXNpczIgPSBiYXNpczI7XG4gICAgaWYgKHByZXZRdWF0ZXJuaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZXh0cmFRdWF0ZXJuaW9uUiA9IFF1YXRlcm5pb24uSW52ZXJzZShwcmV2UXVhdGVybmlvbik7XG4gICAgICAgIHRoaXNCYXNpczEgPSBiYXNpczEucm90YXRlQnlRdWF0ZXJuaW9uKGV4dHJhUXVhdGVybmlvblIpO1xuICAgICAgICB0aGlzQmFzaXMyID0gYmFzaXMyLnJvdGF0ZUJ5UXVhdGVybmlvbihleHRyYVF1YXRlcm5pb25SKTtcbiAgICB9XG4gICAgY29uc3Qgcm90YXRpb25CYXNpczEgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uUXVhdGVybmlvbkZyb21BeGlzKFxuICAgICAgICB0aGlzQmFzaXMxLnguY2xvbmUoKSxcbiAgICAgICAgdGhpc0Jhc2lzMS55LmNsb25lKCksXG4gICAgICAgIHRoaXNCYXNpczEuei5jbG9uZSgpKTtcbiAgICBjb25zdCByb3RhdGlvbkJhc2lzMiA9IFF1YXRlcm5pb24uUm90YXRpb25RdWF0ZXJuaW9uRnJvbUF4aXMoXG4gICAgICAgIHRoaXNCYXNpczIueC5jbG9uZSgpLFxuICAgICAgICB0aGlzQmFzaXMyLnkuY2xvbmUoKSxcbiAgICAgICAgdGhpc0Jhc2lzMi56LmNsb25lKCkpO1xuXG4gICAgY29uc3QgcXVhdGVybmlvbjMxID0gcm90YXRpb25CYXNpczEuY2xvbmUoKS5ub3JtYWxpemUoKTtcbiAgICBjb25zdCBxdWF0ZXJuaW9uMzFSID0gUXVhdGVybmlvbi5JbnZlcnNlKHF1YXRlcm5pb24zMSk7XG4gICAgY29uc3QgcXVhdGVybmlvbjMyID0gcm90YXRpb25CYXNpczIuY2xvbmUoKS5ub3JtYWxpemUoKTtcbiAgICByZXR1cm4gcXVhdGVybmlvbjMyLm11bHRpcGx5KHF1YXRlcm5pb24zMVIpO1xufVxuXG4vKlxuICogTGVmdCBoYW5kZWQgZm9yIEJKUy5cbiAqIEVhY2ggb2JqZWN0IGlzIGRlZmluZWQgYnkgMyBwb2ludHMuXG4gKiBBc3N1bWUgYSBpcyBvcmlnaW4sIGIgcG9pbnRzIHRvICt4LCBhYmMgZm9ybXMgWFkgcGxhbmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNpcyhvYmo6IFZlY3RvcjMzKTogQmFzaXMge1xuICAgIGNvbnN0IFthLCBiLCBjXSA9IG9iajtcbiAgICBjb25zdCBwbGFuZVhZID0gUGxhbmUuRnJvbVBvaW50cyhhLCBiLCBjKS5ub3JtYWxpemUoKTtcbiAgICBjb25zdCBheGlzWCA9IGIuc3VidHJhY3QoYSkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgYXhpc1ogPSBwbGFuZVhZLm5vcm1hbDtcbiAgICAvLyBQcm9qZWN0IGMgb250byBhYlxuICAgIGNvbnN0IGNwID0gYS5hZGQoXG4gICAgICAgIGF4aXNYLnNjYWxlKFZlY3RvcjMuRG90KGMuc3VidHJhY3QoYSksIGF4aXNYKSAvIFZlY3RvcjMuRG90KGF4aXNYLCBheGlzWCkpXG4gICAgKTtcbiAgICBjb25zdCBheGlzWSA9IGMuc3VidHJhY3QoY3ApLm5vcm1hbGl6ZSgpO1xuICAgIHJldHVybiBuZXcgQmFzaXMoW2F4aXNYLCBheGlzWSwgYXhpc1pdKTtcbn1cblxuLy8gUHJvamVjdCBwb2ludHMgdG8gYW4gYXZlcmFnZSBwbGFuZVxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNBdmdQbGFuZShwdHM6IFZlY3RvcjNbXSwgbm9ybWFsOiBWZWN0b3IzKTogVmVjdG9yM1tdIHtcbiAgICBpZiAocHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtWZWN0b3IzLlplcm8oKV07XG4gICAgY29uc3QgYXZnUHQgPSBwdHMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICAgIHJldHVybiBwcmV2LmFkZChjdXJyKTtcbiAgICB9KS5zY2FsZSgxIC8gcHRzLmxlbmd0aCk7XG5cbiAgICBjb25zdCByZXQgPSBwdHMubWFwKCh2KSA9PiB7XG4gICAgICAgIHJldHVybiB2LnN1YnRyYWN0KG5vcm1hbC5zY2FsZShWZWN0b3IzLkRvdChub3JtYWwsIHYuc3VidHJhY3QoYXZnUHQpKSkpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0O1xufVxuIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMiAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBWZWN0b3IzfSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5pbXBvcnQgS2FsbWFuRmlsdGVyIGZyb20gXCJrYWxtYW5qc1wiO1xuXG5leHBvcnQgY29uc3QgVklTSUJJTElUWV9USFJFU0hPTEQ6IG51bWJlciA9IDAuNjtcblxuZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJQYXJhbXMge1xuICAgIFI/OiBudW1iZXIsXG4gICAgUT86IG51bWJlcixcbiAgICBvbmVFdXJvQ3V0b2ZmPzogbnVtYmVyLFxuICAgIG9uZUV1cm9CZXRhPzogbnVtYmVyLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBnYXVzc2lhblNpZ21hPzogbnVtYmVyLFxufVxuXG4vLyAxRCBHYXVzc2lhbiBLZXJuZWxcbmV4cG9ydCBjb25zdCBnYXVzc2lhbktlcm5lbDFkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc3FyMnBpID0gTWF0aC5zcXJ0KDIgKiBNYXRoLlBJKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiBnYXVzc2lhbktlcm5lbDFkIChzaXplOiBudW1iZXIsIHNpZ21hOiBudW1iZXIpIHtcbiAgICAgICAgLy8gZW5zdXJlIHNpemUgaXMgZXZlbiBhbmQgcHJlcGFyZSB2YXJpYWJsZXNcbiAgICAgICAgbGV0IHdpZHRoID0gKHNpemUgLyAyKSB8IDAsXG4gICAgICAgICAgICBrZXJuZWwgPSBuZXcgQXJyYXkod2lkdGggKiAyICsgMSksXG4gICAgICAgICAgICBub3JtID0gMS4wIC8gKHNxcjJwaSAqIHNpZ21hKSxcbiAgICAgICAgICAgIGNvZWZmaWNpZW50ID0gMiAqIHNpZ21hICogc2lnbWEsXG4gICAgICAgICAgICB0b3RhbCA9IDAsXG4gICAgICAgICAgICB4O1xuXG4gICAgICAgIC8vIHNldCB2YWx1ZXMgYW5kIGluY3JlbWVudCB0b3RhbFxuICAgICAgICBmb3IgKHggPSAtd2lkdGg7IHggPD0gd2lkdGg7IHgrKykge1xuICAgICAgICAgICAgdG90YWwgKz0ga2VybmVsW3dpZHRoICsgeF0gPSBub3JtICogTWF0aC5leHAoLXggKiB4IC8gY29lZmZpY2llbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGl2aWRlIGJ5IHRvdGFsIHRvIG1ha2Ugc3VyZSB0aGUgc3VtIG9mIGFsbCB0aGUgdmFsdWVzIGlzIGVxdWFsIHRvIDFcbiAgICAgICAgZm9yICh4ID0gMDsgeCA8IGtlcm5lbC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAga2VybmVsW3hdIC89IHRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtlcm5lbDtcbiAgICB9O1xufSgpKTtcblxuLypcbiAqIENvbnZlcnRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qYWFudG9sbGFuZGVyL09uZUV1cm9GaWx0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBPbmVFdXJvVmVjdG9yRmlsdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHRfcHJldjogbnVtYmVyLFxuICAgICAgICBwdWJsaWMgeF9wcmV2OiBWZWN0b3IzLFxuICAgICAgICBwcml2YXRlIGR4X3ByZXYgPSBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgcHVibGljIG1pbl9jdXRvZmYgPSAxLjAsXG4gICAgICAgIHB1YmxpYyBiZXRhID0gMC4wLFxuICAgICAgICBwdWJsaWMgZF9jdXRvZmYgPSAxLjBcbiAgICApIHtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzbW9vdGhpbmdfZmFjdG9yKHRfZTogbnVtYmVyLCBjdXRvZmY6IG51bWJlcikge1xuICAgICAgICBjb25zdCByID0gMiAqIE1hdGguUEkgKiBjdXRvZmYgKiB0X2U7XG4gICAgICAgIHJldHVybiByIC8gKHIgKyAxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBleHBvbmVudGlhbF9zbW9vdGhpbmcoYTogbnVtYmVyLCB4OiBWZWN0b3IzLCB4X3ByZXY6IFZlY3RvcjMpIHtcbiAgICAgICAgcmV0dXJuIHguc2NhbGUoYSkuYWRkSW5QbGFjZSh4X3ByZXYuc2NhbGUoKDEgLSBhKSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZXh0KHQ6IG51bWJlciwgeDogVmVjdG9yMykge1xuICAgICAgICBjb25zdCB0X2UgPSB0IC0gdGhpcy50X3ByZXY7XG5cbiAgICAgICAgLy8gVGhlIGZpbHRlcmVkIGRlcml2YXRpdmUgb2YgdGhlIHNpZ25hbC5cbiAgICAgICAgY29uc3QgYV9kID0gT25lRXVyb1ZlY3RvckZpbHRlci5zbW9vdGhpbmdfZmFjdG9yKHRfZSwgdGhpcy5kX2N1dG9mZik7XG4gICAgICAgIGNvbnN0IGR4ID0geC5zdWJ0cmFjdCh0aGlzLnhfcHJldikuc2NhbGVJblBsYWNlKDEgLyB0X2UpO1xuICAgICAgICBjb25zdCBkeF9oYXQgPSBPbmVFdXJvVmVjdG9yRmlsdGVyLmV4cG9uZW50aWFsX3Ntb290aGluZyhhX2QsIGR4LCB0aGlzLmR4X3ByZXYpO1xuXG4gICAgICAgIC8vIFRoZSBmaWx0ZXJlZCBzaWduYWwuXG4gICAgICAgIGNvbnN0IGN1dG9mZiA9IHRoaXMubWluX2N1dG9mZiArIHRoaXMuYmV0YSAqIGR4X2hhdC5sZW5ndGgoKTtcbiAgICAgICAgY29uc3QgYSA9IE9uZUV1cm9WZWN0b3JGaWx0ZXIuc21vb3RoaW5nX2ZhY3Rvcih0X2UsIGN1dG9mZik7XG4gICAgICAgIGNvbnN0IHhfaGF0ID0gT25lRXVyb1ZlY3RvckZpbHRlci5leHBvbmVudGlhbF9zbW9vdGhpbmcoYSwgeCwgdGhpcy54X3ByZXYpO1xuXG4gICAgICAgIC8vIE1lbW9yaXplIHRoZSBwcmV2aW91cyB2YWx1ZXMuXG4gICAgICAgIHRoaXMueF9wcmV2ID0geF9oYXQ7XG4gICAgICAgIHRoaXMuZHhfcHJldiA9IGR4X2hhdDtcbiAgICAgICAgdGhpcy50X3ByZXYgPSB0O1xuXG4gICAgICAgIHJldHVybiB4X2hhdDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgS2FsbWFuVmVjdG9yRmlsdGVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGthbG1hbkZpbHRlclg7XG4gICAgcHJpdmF0ZSByZWFkb25seSBrYWxtYW5GaWx0ZXJZO1xuICAgIHByaXZhdGUgcmVhZG9ubHkga2FsbWFuRmlsdGVyWjtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIFIgPSAwLjEsXG4gICAgICAgIHB1YmxpYyBRID0gMyxcbiAgICApIHtcbiAgICAgICAgdGhpcy5rYWxtYW5GaWx0ZXJYID0gbmV3IEthbG1hbkZpbHRlcih7UTogUSwgUjogUn0pO1xuICAgICAgICB0aGlzLmthbG1hbkZpbHRlclkgPSBuZXcgS2FsbWFuRmlsdGVyKHtROiBRLCBSOiBSfSk7XG4gICAgICAgIHRoaXMua2FsbWFuRmlsdGVyWiA9IG5ldyBLYWxtYW5GaWx0ZXIoe1E6IFEsIFI6IFJ9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmV4dCh0OiBudW1iZXIsIHZlYzogVmVjdG9yMykge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZXMgPSBbXG4gICAgICAgICAgICB0aGlzLmthbG1hbkZpbHRlclguZmlsdGVyKHZlYy54KSxcbiAgICAgICAgICAgIHRoaXMua2FsbWFuRmlsdGVyWS5maWx0ZXIodmVjLnkpLFxuICAgICAgICAgICAgdGhpcy5rYWxtYW5GaWx0ZXJaLmZpbHRlcih2ZWMueiksXG4gICAgICAgIF1cblxuICAgICAgICByZXR1cm4gVmVjdG9yMy5Gcm9tQXJyYXkobmV3VmFsdWVzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHYXVzc2lhblZlY3RvckZpbHRlciB7XG4gICAgcHJpdmF0ZSBfdmFsdWVzOiBWZWN0b3IzW10gPSBbXTtcbiAgICBnZXQgdmFsdWVzKCk6IFZlY3RvcjNbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gICAgfVxuICAgIHByaXZhdGUgcmVhZG9ubHkga2VybmVsOiBudW1iZXJbXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHNpZ21hOiBudW1iZXJcbiAgICApIHtcbiAgICAgICAgaWYgKHNpemUgPCAyKSB0aHJvdyBSYW5nZUVycm9yKFwiRmlsdGVyIHNpemUgdG9vIHNob3J0XCIpO1xuICAgICAgICB0aGlzLnNpemUgPSBNYXRoLmZsb29yKHNpemUpO1xuICAgICAgICB0aGlzLmtlcm5lbCA9IGdhdXNzaWFuS2VybmVsMWQoc2l6ZSwgc2lnbWEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXNoKHY6IFZlY3RvcjMpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh2KTtcblxuICAgICAgICBpZiAodGhpcy52YWx1ZXMubGVuZ3RoID09PSB0aGlzLnNpemUgKyAxKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5zaGlmdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCA+IHRoaXMuc2l6ZSArIDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW50ZXJuYWwgcXVldWUgaGFzIGxlbmd0aCBsb25nZXIgdGhhbiBzaXplOiAke3RoaXMuc2l6ZX1gKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnNsaWNlKC10aGlzLnNpemUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnZhbHVlcy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhcHBseSgpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCAhPT0gdGhpcy5zaXplKSByZXR1cm4gVmVjdG9yMy5aZXJvKCk7XG4gICAgICAgIGNvbnN0IHJldCA9IFZlY3RvcjMuWmVybygpO1xuICAgICAgICBjb25zdCBsZW4wID0gcmV0Lmxlbmd0aCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgKytpKSB7XG4gICAgICAgICAgICByZXQuYWRkSW5QbGFjZSh0aGlzLnZhbHVlc1tpXS5zY2FsZSh0aGlzLmtlcm5lbFtpXSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbjEgPSByZXQubGVuZ3RoKCk7XG4gICAgICAgIC8vIE5vcm1hbGl6ZSB0byBvcmlnaW5hbCBsZW5ndGhcbiAgICAgICAgcmV0LnNjYWxlSW5QbGFjZShsZW4wIC8gbGVuMSk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdWNsaWRlYW5IaWdoUGFzc0ZpbHRlciB7XG4gICAgcHJpdmF0ZSBfdmFsdWU6IFZlY3RvcjMgPSBWZWN0b3IzLlplcm8oKTtcbiAgICBnZXQgdmFsdWUoKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSB0aHJlc2hvbGQ6IG51bWJlclxuICAgICkge31cblxuICAgIHB1YmxpYyB1cGRhdGUodjogVmVjdG9yMykge1xuICAgICAgICBpZiAodGhpcy52YWx1ZS5zdWJ0cmFjdCh2KS5sZW5ndGgoKSA+IHRoaXMudGhyZXNob2xkKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHY7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgfVxufVxuIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMiAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQge05vcm1hbGl6ZWRMYW5kbWFyaywgUmVzdWx0c30gZnJvbSBcIkBtZWRpYXBpcGUvaG9saXN0aWNcIjtcbmltcG9ydCB7TnVsbGFibGUsIFZlY3RvcjN9IGZyb20gXCJAYmFieWxvbmpzL2NvcmVcIjtcbmltcG9ydCB7XG4gICAgRmlsdGVyUGFyYW1zLFxuICAgIEdhdXNzaWFuVmVjdG9yRmlsdGVyLFxuICAgIEthbG1hblZlY3RvckZpbHRlcixcbiAgICBPbmVFdXJvVmVjdG9yRmlsdGVyLFxuICAgIFZJU0lCSUxJVFlfVEhSRVNIT0xEXG59IGZyb20gXCIuL2ZpbHRlclwiO1xuaW1wb3J0IHtvYmplY3RGbGlwfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyZWRMYW5kbWFya1ZlY3RvciB7XG4gICAgcHJpdmF0ZSBtYWluRmlsdGVyOiBPbmVFdXJvVmVjdG9yRmlsdGVyIHwgS2FsbWFuVmVjdG9yRmlsdGVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2F1c3NpYW5WZWN0b3JGaWx0ZXI6IE51bGxhYmxlPEdhdXNzaWFuVmVjdG9yRmlsdGVyPiA9IG51bGw7XG5cbiAgICBwcml2YXRlIF90ID0gMDtcbiAgICBnZXQgdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdDtcbiAgICB9XG5cbiAgICBzZXQgdCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3QgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wb3MgPSBWZWN0b3IzLlplcm8oKTtcbiAgICBnZXQgcG9zKCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zO1xuICAgIH1cblxuICAgIHB1YmxpYyB2aXNpYmlsaXR5OiBudW1iZXIgfCB1bmRlZmluZWQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHBhcmFtczogRmlsdGVyUGFyYW1zID0ge1xuICAgICAgICAgICAgb25lRXVyb0N1dG9mZjogMC4wMSxcbiAgICAgICAgICAgIG9uZUV1cm9CZXRhOiAwLFxuICAgICAgICAgICAgdHlwZTogJ09uZUV1cm8nXG4gICAgICAgIH1cbiAgICApIHtcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlID09PSBcIkthbG1hblwiKVxuICAgICAgICAgICAgdGhpcy5tYWluRmlsdGVyID0gbmV3IEthbG1hblZlY3RvckZpbHRlcihwYXJhbXMuUiwgcGFyYW1zLlEpO1xuICAgICAgICBlbHNlIGlmIChwYXJhbXMudHlwZSA9PT0gXCJPbmVFdXJvXCIpXG4gICAgICAgICAgICB0aGlzLm1haW5GaWx0ZXIgPSBuZXcgT25lRXVyb1ZlY3RvckZpbHRlcihcbiAgICAgICAgICAgICAgICB0aGlzLnQsXG4gICAgICAgICAgICAgICAgdGhpcy5wb3MsXG4gICAgICAgICAgICAgICAgVmVjdG9yMy5aZXJvKCksXG4gICAgICAgICAgICAgICAgcGFyYW1zLm9uZUV1cm9DdXRvZmYsXG4gICAgICAgICAgICAgICAgcGFyYW1zLm9uZUV1cm9CZXRhKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJXcm9uZyBmaWx0ZXIgdHlwZSFcIik7XG4gICAgICAgIGlmIChwYXJhbXMuZ2F1c3NpYW5TaWdtYSlcbiAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIgPSBuZXcgR2F1c3NpYW5WZWN0b3JGaWx0ZXIoNSwgcGFyYW1zLmdhdXNzaWFuU2lnbWEpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVQb3NpdGlvbihwb3M6IFZlY3RvcjMsIHZpc2liaWxpdHk/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50ICs9IDE7XG5cbiAgICAgICAgLy8gRmFjZSBNZXNoIGhhcyBubyB2aXNpYmlsaXR5XG4gICAgICAgIGlmICh2aXNpYmlsaXR5ID09PSB1bmRlZmluZWQgfHwgdmlzaWJpbGl0eSA+IFZJU0lCSUxJVFlfVEhSRVNIT0xEKSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLm1haW5GaWx0ZXIubmV4dCh0aGlzLnQsIHBvcyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdhdXNzaWFuVmVjdG9yRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYXVzc2lhblZlY3RvckZpbHRlci5wdXNoKHBvcyk7XG4gICAgICAgICAgICAgICAgcG9zID0gdGhpcy5nYXVzc2lhblZlY3RvckZpbHRlci5hcHBseSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9wb3MgPSBwb3M7XG5cbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0ID0gRmlsdGVyZWRMYW5kbWFya1ZlY3RvcltdO1xuXG5leHBvcnQgdHlwZSBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yMyA9IFtcbiAgICBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yLFxuICAgIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IsXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcixcbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvbmVhYmxlUmVzdWx0cyBleHRlbmRzIE9taXQ8UmVzdWx0cywgJ3NlZ21lbnRhdGlvbk1hc2snIHwgJ2ltYWdlJz4ge1xufVxuXG5leHBvcnQgY29uc3QgUE9TRV9MQU5ETUFSS19MRU5HVEggPSAzMztcbmV4cG9ydCBjb25zdCBGQUNFX0xBTkRNQVJLX0xFTkdUSCA9IDQ3ODtcbmV4cG9ydCBjb25zdCBIQU5EX0xBTkRNQVJLX0xFTkdUSCA9IDIxO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplZExhbmRtYXJrVG9WZWN0b3IgPSAoXG4gICAgbDogTm9ybWFsaXplZExhbmRtYXJrLFxuICAgIHNjYWxpbmcgPSAxLixcbiAgICByZXZlcnNlWSA9IGZhbHNlKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKFxuICAgICAgICBsLnggKiBzY2FsaW5nLFxuICAgICAgICByZXZlcnNlWSA/IC1sLnkgKiBzY2FsaW5nIDogbC55ICogc2NhbGluZyxcbiAgICAgICAgbC56ICogc2NhbGluZyk7XG59XG5leHBvcnQgY29uc3QgdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsgPSAobDogVmVjdG9yMyk6IE5vcm1hbGl6ZWRMYW5kbWFyayA9PiB7XG4gICAgcmV0dXJuIHt4OiBsLngsIHk6IGwueSwgejogbC56fTtcbn07XG5cbmV4cG9ydCBjb25zdCBIQU5EX0xBTkRNQVJLUyA9IHtcbiAgICBXUklTVDogMCxcbiAgICBUSFVNQl9DTUM6IDEsXG4gICAgVEhVTUJfTUNQOiAyLFxuICAgIFRIVU1CX0lQOiAzLFxuICAgIFRIVU1CX1RJUDogNCxcbiAgICBJTkRFWF9GSU5HRVJfTUNQOiA1LFxuICAgIElOREVYX0ZJTkdFUl9QSVA6IDYsXG4gICAgSU5ERVhfRklOR0VSX0RJUDogNyxcbiAgICBJTkRFWF9GSU5HRVJfVElQOiA4LFxuICAgIE1JRERMRV9GSU5HRVJfTUNQOiA5LFxuICAgIE1JRERMRV9GSU5HRVJfUElQOiAxMCxcbiAgICBNSURETEVfRklOR0VSX0RJUDogMTEsXG4gICAgTUlERExFX0ZJTkdFUl9USVA6IDEyLFxuICAgIFJJTkdfRklOR0VSX01DUDogMTMsXG4gICAgUklOR19GSU5HRVJfUElQOiAxNCxcbiAgICBSSU5HX0ZJTkdFUl9ESVA6IDE1LFxuICAgIFJJTkdfRklOR0VSX1RJUDogMTYsXG4gICAgUElOS1lfTUNQOiAxNyxcbiAgICBQSU5LWV9QSVA6IDE4LFxuICAgIFBJTktZX0RJUDogMTksXG4gICAgUElOS1lfVElQOiAyMCxcbn07XG5cbmV4cG9ydCBjb25zdCBIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkcgPSB7XG4gICAgSGFuZDogSEFORF9MQU5ETUFSS1MuV1JJU1QsXG4gICAgVGh1bWJQcm94aW1hbDogSEFORF9MQU5ETUFSS1MuVEhVTUJfQ01DLFxuICAgIFRodW1iSW50ZXJtZWRpYXRlOiBIQU5EX0xBTkRNQVJLUy5USFVNQl9NQ1AsXG4gICAgVGh1bWJEaXN0YWw6IEhBTkRfTEFORE1BUktTLlRIVU1CX0lQLFxuICAgIEluZGV4UHJveGltYWw6IEhBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9NQ1AsXG4gICAgSW5kZXhJbnRlcm1lZGlhdGU6IEhBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9QSVAsXG4gICAgSW5kZXhEaXN0YWw6IEhBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9ESVAsXG4gICAgTWlkZGxlUHJveGltYWw6IEhBTkRfTEFORE1BUktTLk1JRERMRV9GSU5HRVJfTUNQLFxuICAgIE1pZGRsZUludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuTUlERExFX0ZJTkdFUl9QSVAsXG4gICAgTWlkZGxlRGlzdGFsOiBIQU5EX0xBTkRNQVJLUy5NSURETEVfRklOR0VSX0RJUCxcbiAgICBSaW5nUHJveGltYWw6IEhBTkRfTEFORE1BUktTLlJJTkdfRklOR0VSX01DUCxcbiAgICBSaW5nSW50ZXJtZWRpYXRlOiBIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9QSVAsXG4gICAgUmluZ0Rpc3RhbDogSEFORF9MQU5ETUFSS1MuUklOR19GSU5HRVJfRElQLFxuICAgIExpdHRsZVByb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1AsXG4gICAgTGl0dGxlSW50ZXJtZWRpYXRlOiBIQU5EX0xBTkRNQVJLUy5QSU5LWV9QSVAsXG4gICAgTGl0dGxlRGlzdGFsOiBIQU5EX0xBTkRNQVJLUy5QSU5LWV9ESVAsXG59O1xuZXhwb3J0IGNvbnN0IEhBTkRfTEFORE1BUktTX0JPTkVfUkVWRVJTRV9NQVBQSU5HOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9ID0gb2JqZWN0RmxpcChIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkcpO1xuZXhwb3J0IHR5cGUgSGFuZEJvbmVNYXBwaW5nS2V5ID0ga2V5b2YgdHlwZW9mIEhBTkRfTEFORE1BUktTX0JPTkVfTUFQUElORztcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRMYW5kTWFya1RvQm9uZU5hbWUobGFuZG1hcms6IG51bWJlciwgaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgaWYgKCEobGFuZG1hcmsgaW4gSEFORF9MQU5ETUFSS1NfQk9ORV9SRVZFUlNFX01BUFBJTkcpKSB0aHJvdyBFcnJvcihcIldyb25nIGxhbmRtYXJrIGdpdmVuIVwiKTtcbiAgICByZXR1cm4gKGlzTGVmdCA/ICdsZWZ0JyA6ICdyaWdodCcpICsgSEFORF9MQU5ETUFSS1NfQk9ORV9SRVZFUlNFX01BUFBJTkdbbGFuZG1hcmtdO1xufVxuXG4vKlxuICogRGVwdGgtZmlyc3Qgc2VhcmNoL3dhbGsgb2YgYSBnZW5lcmljIHRyZWUuXG4gKiBBbHNvIHJldHVybnMgYSBtYXAgZm9yIGJhY2t0cmFja2luZyBmcm9tIGxlYWYuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXB0aEZpcnN0U2VhcmNoKFxuICAgIHJvb3ROb2RlOiBhbnksXG4gICAgZjogKG46IGFueSkgPT4gYm9vbGVhblxuKTogW2FueSwgYW55XSB7XG4gICAgY29uc3Qgc3RhY2sgPSBbXTtcbiAgICBjb25zdCBwYXJlbnRNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwPGFueSwgYW55PigpO1xuICAgIHN0YWNrLnB1c2gocm9vdE5vZGUpO1xuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAvLyByZW1vdmUgdGhlIGZpcnN0IGNoaWxkIGluIHRoZSBzdGFja1xuICAgICAgICBjb25zdCBjdXJyZW50Tm9kZTogYW55ID0gc3RhY2suc3BsaWNlKC0xLCAxKVswXTtcbiAgICAgICAgY29uc3QgcmV0VmFsID0gZihjdXJyZW50Tm9kZSk7XG4gICAgICAgIGlmIChyZXRWYWwpIHJldHVybiBbY3VycmVudE5vZGUsIHBhcmVudE1hcF07XG5cbiAgICAgICAgY29uc3QgY3VycmVudENoaWxkcmVuID0gY3VycmVudE5vZGUuY2hpbGRyZW47XG4gICAgICAgIC8vIGFkZCBhbnkgY2hpbGRyZW4gaW4gdGhlIG5vZGUgYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2tcbiAgICAgICAgaWYgKGN1cnJlbnRDaGlsZHJlbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGN1cnJlbnRDaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IGN1cnJlbnRDaGlsZHJlbltpbmRleF07XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKCEocGFyZW50TWFwLmhhcyhjaGlsZCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE1hcC5zZXQoY2hpbGQsIGN1cnJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtudWxsLCBudWxsXTtcbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjIgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHtOdWxsYWJsZSwgUXVhdGVybmlvbiwgQW5nbGUsIFZlY3RvcjMsIFBsYW5lfSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5pbXBvcnQge3JhbmdlQ2FwfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHtCYXNpcywgcXVhdGVybmlvbkJldHdlZW5CYXNlc30gZnJvbSBcIi4vYmFzaXNcIjtcbmltcG9ydCB7dmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmt9IGZyb20gXCIuL2xhbmRtYXJrXCI7XG5pbXBvcnQge1xuICAgIEZpbHRlclBhcmFtcyxcbiAgICBHYXVzc2lhblZlY3RvckZpbHRlcixcbiAgICBLYWxtYW5WZWN0b3JGaWx0ZXIsXG59IGZyb20gXCIuL2ZpbHRlclwiO1xuXG5leHBvcnQgY2xhc3MgQ2xvbmVhYmxlUXVhdGVybmlvbkxpdGUge1xuICAgIHB1YmxpYyB4OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB5OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB6OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB3OiBudW1iZXIgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHE6IE51bGxhYmxlPFF1YXRlcm5pb24+LFxuICAgICkge1xuICAgICAgICBpZiAocSkge1xuICAgICAgICAgICAgdGhpcy54ID0gcS54O1xuICAgICAgICAgICAgdGhpcy55ID0gcS55O1xuICAgICAgICAgICAgdGhpcy56ID0gcS56O1xuICAgICAgICAgICAgdGhpcy53ID0gcS53O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xvbmVhYmxlUXVhdGVybmlvbiBleHRlbmRzIENsb25lYWJsZVF1YXRlcm5pb25MaXRlIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9iYXNlQmFzaXM6IEJhc2lzO1xuICAgIGdldCBiYXNlQmFzaXMoKTogQmFzaXMge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFzZUJhc2lzO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBxOiBOdWxsYWJsZTxRdWF0ZXJuaW9uPixcbiAgICAgICAgYmFzaXM/OiBCYXNpc1xuICAgICkge1xuICAgICAgICBzdXBlcihxKTtcbiAgICAgICAgdGhpcy5fYmFzZUJhc2lzID0gYmFzaXMgPyBiYXNpcyA6IG5ldyBCYXNpcyhudWxsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0KHE6IFF1YXRlcm5pb24pIHtcbiAgICAgICAgdGhpcy54ID0gcS54O1xuICAgICAgICB0aGlzLnkgPSBxLnk7XG4gICAgICAgIHRoaXMueiA9IHEuejtcbiAgICAgICAgdGhpcy53ID0gcS53O1xuICAgIH1cblxuICAgIHB1YmxpYyByb3RhdGVCYXNpcyhxOiBRdWF0ZXJuaW9uKTogQmFzaXMge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFzZUJhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbihxKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvbmVhYmxlUXVhdGVybmlvbk1hcCB7XG4gICAgW2tleTogc3RyaW5nXTogQ2xvbmVhYmxlUXVhdGVybmlvblxufVxuXG5leHBvcnQgdHlwZSBDbG9uZWFibGVRdWF0ZXJuaW9uTGlzdCA9IENsb25lYWJsZVF1YXRlcm5pb25bXTtcbmV4cG9ydCBjb25zdCBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uID0gKHE6IENsb25lYWJsZVF1YXRlcm5pb25MaXRlKTogUXVhdGVybmlvbiA9PiB7XG4gICAgY29uc3QgcmV0ID0gbmV3IFF1YXRlcm5pb24ocS54LCBxLnksIHEueiwgcS53KTtcbiAgICByZXR1cm4gcmV0O1xufTtcblxuZXhwb3J0IGNsYXNzIEZpbHRlcmVkUXVhdGVybmlvbiB7XG4gICAgcHJpdmF0ZSBtYWluRmlsdGVyOiBLYWxtYW5WZWN0b3JGaWx0ZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBnYXVzc2lhblZlY3RvckZpbHRlcjogTnVsbGFibGU8R2F1c3NpYW5WZWN0b3JGaWx0ZXI+ID0gbnVsbDtcblxuICAgIHByaXZhdGUgX3QgPSAwO1xuICAgIGdldCB0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl90O1xuICAgIH1cbiAgICBzZXQgdCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3QgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yb3QgPSBRdWF0ZXJuaW9uLklkZW50aXR5KCk7XG4gICAgZ2V0IHJvdCgpOiBRdWF0ZXJuaW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcGFyYW1zOiBGaWx0ZXJQYXJhbXMgPSB7XG4gICAgICAgICAgICBSOiAxLFxuICAgICAgICAgICAgUTogMSxcbiAgICAgICAgICAgIHR5cGU6ICdLYWxtYW4nXG4gICAgICAgIH1cbiAgICApIHtcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlID09PSBcIkthbG1hblwiKVxuICAgICAgICAgICAgdGhpcy5tYWluRmlsdGVyID0gbmV3IEthbG1hblZlY3RvckZpbHRlcihwYXJhbXMuUiwgcGFyYW1zLlEpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIldyb25nIGZpbHRlciB0eXBlIVwiKTtcbiAgICAgICAgaWYgKHBhcmFtcy5nYXVzc2lhblNpZ21hKVxuICAgICAgICAgICAgdGhpcy5nYXVzc2lhblZlY3RvckZpbHRlciA9IG5ldyBHYXVzc2lhblZlY3RvckZpbHRlcig1LCBwYXJhbXMuZ2F1c3NpYW5TaWdtYSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVJvdGF0aW9uKHJvdDogUXVhdGVybmlvbikge1xuICAgICAgICB0aGlzLnQgKz0gMTtcbiAgICAgICAgbGV0IGFuZ2xlcyA9IHJvdC50b0V1bGVyQW5nbGVzKCk7XG4gICAgICAgIGFuZ2xlcyA9IHRoaXMubWFpbkZpbHRlci5uZXh0KHRoaXMudCwgYW5nbGVzKTtcblxuICAgICAgICBpZiAodGhpcy5nYXVzc2lhblZlY3RvckZpbHRlcikge1xuICAgICAgICAgICAgdGhpcy5nYXVzc2lhblZlY3RvckZpbHRlci5wdXNoKGFuZ2xlcyk7XG4gICAgICAgICAgICBhbmdsZXMgPSB0aGlzLmdhdXNzaWFuVmVjdG9yRmlsdGVyLmFwcGx5KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yb3QgPSBRdWF0ZXJuaW9uLkZyb21FdWxlclZlY3RvcihhbmdsZXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgRmlsdGVyZWRRdWF0ZXJuaW9uTGlzdCA9IEZpbHRlcmVkUXVhdGVybmlvbltdO1xuXG5cbmV4cG9ydCBlbnVtIEFYSVMge1xuICAgIHgsXG4gICAgeSxcbiAgICB6LFxuICAgIHh5LFxuICAgIHl6LFxuICAgIHh6LFxuICAgIHh5eixcbiAgICBub25lID0gMTBcbn1cblxuLy8gQ29udmVuaWVuY2UgZnVuY3Rpb25zXG5leHBvcnQgY29uc3QgUmFkVG9EZWcgPSAocjogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIEFuZ2xlLkZyb21SYWRpYW5zKHIpLmRlZ3JlZXMoKTtcbn1cbmV4cG9ydCBjb25zdCBEZWdUb1JhZCA9IChkOiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gQW5nbGUuRnJvbURlZ3JlZXMoZCkucmFkaWFucygpO1xufVxuXG4vKipcbiAqIENoZWNrIGEgcXVhdGVybmlvbiBpcyB2YWxpZFxuICogQHBhcmFtIHEgSW5wdXQgcXVhdGVybmlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24pIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKHEueCkgJiYgTnVtYmVyLmlzRmluaXRlKHEueSkgJiYgTnVtYmVyLmlzRmluaXRlKHEueikgJiYgTnVtYmVyLmlzRmluaXRlKHEudyk7XG59XG5cbi8vIFNpbWlsYXIgdG8gdGhyZWUuanMgUXVhdGVybmlvbi5zZXRGcm9tVW5pdFZlY3RvcnNcbmV4cG9ydCBjb25zdCBxdWF0ZXJuaW9uQmV0d2VlblZlY3RvcnMgPSAoXG4gICAgdjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzLFxuKTogUXVhdGVybmlvbiA9PiB7XG4gICAgY29uc3QgYW5nbGUgPSBWZWN0b3IzLkdldEFuZ2xlQmV0d2VlblZlY3RvcnModjEsIHYyLCBWZWN0b3IzLkNyb3NzKHYxLCB2MikpXG4gICAgY29uc3QgYXhpcyA9IFZlY3RvcjMuQ3Jvc3ModjEsIHYyKTtcbiAgICBheGlzLm5vcm1hbGl6ZSgpO1xuICAgIHJldHVybiBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyhheGlzLCBhbmdsZSk7XG59O1xuLyoqXG4gKiBTYW1lIGFzIGFib3ZlLCBFdWxlciBhbmdsZSB2ZXJzaW9uXG4gKiBAcGFyYW0gdjEgSW5wdXQgcm90YXRpb24gaW4gZGVncmVlcyAxXG4gKiBAcGFyYW0gdjIgSW5wdXQgcm90YXRpb24gaW4gZGVncmVlcyAyXG4gKiBAcGFyYW0gcmVtYXBEZWdyZWUgV2hldGhlciByZS1tYXAgZGVncmVlc1xuICovXG5leHBvcnQgY29uc3QgZGVncmVlQmV0d2VlblZlY3RvcnMgPSAoXG4gICAgdjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzLCByZW1hcERlZ3JlZSA9IGZhbHNlXG4pID0+IHtcbiAgICByZXR1cm4gcXVhdGVybmlvblRvRGVncmVlcyhxdWF0ZXJuaW9uQmV0d2VlblZlY3RvcnModjEsIHYyKSwgcmVtYXBEZWdyZWUpO1xufTtcbi8qKlxuICogUmUtbWFwIGRlZ3JlZXMgdG8gLTE4MCB0byAxODBcbiAqIEBwYXJhbSBkZWcgSW5wdXQgYW5nbGUgaW4gRGVncmVlc1xuICovXG5leHBvcnQgY29uc3QgcmVtYXBEZWdyZWVXaXRoQ2FwID0gKGRlZzogbnVtYmVyKSA9PiB7XG4gICAgZGVnID0gcmFuZ2VDYXAoZGVnLCAwLCAzNjApO1xuICAgIHJldHVybiBkZWcgPCAxODAgPyBkZWcgOiBkZWcgLSAzNjA7XG59XG4vKipcbiAqIENvbnZlcnQgcXVhdGVybmlvbnMgdG8gZGVncmVlc1xuICogQHBhcmFtIHEgSW5wdXQgcXVhdGVybmlvblxuICogQHBhcmFtIHJlbWFwRGVncmVlIHdoZXRoZXIgcmUtbWFwIGRlZ3JlZXNcbiAqL1xuZXhwb3J0IGNvbnN0IHF1YXRlcm5pb25Ub0RlZ3JlZXMgPSAoXG4gICAgcTogUXVhdGVybmlvbixcbiAgICByZW1hcERlZ3JlZSA9IGZhbHNlLFxuKSA9PiB7XG4gICAgY29uc3QgYW5nbGVzID0gcS50b0V1bGVyQW5nbGVzKCk7XG4gICAgY29uc3QgcmVtYXBGbiA9IHJlbWFwRGVncmVlID8gcmVtYXBEZWdyZWVXaXRoQ2FwIDogKHg6IG51bWJlcikgPT4geDtcbiAgICByZXR1cm4gbmV3IFZlY3RvcjMoXG4gICAgICAgIHJlbWFwRm4oUmFkVG9EZWcoYW5nbGVzLngpKSxcbiAgICAgICAgcmVtYXBGbihSYWRUb0RlZyhhbmdsZXMueSkpLFxuICAgICAgICByZW1hcEZuKFJhZFRvRGVnKGFuZ2xlcy56KSksXG4gICAgKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0d28gZGlyZWN0aW9ucyBhcmUgY2xvc2UgZW5vdWdoIHdpdGhpbiBhIHNtYWxsIHZhbHVlc1xuICogQHBhcmFtIHYxIElucHV0IGRpcmVjdGlvbiAxXG4gKiBAcGFyYW0gdjIgSW5wdXQgZGlyZWN0aW9uIDJcbiAqIEBwYXJhbSBlcHMgRXJyb3IgdGhyZXNob2xkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2ZWN0b3JzU2FtZURpcldpdGhpbkVwcyh2MTogVmVjdG9yMywgdjI6IFZlY3RvcjMsIGVwcyA9IDFlLTYpIHtcbiAgICByZXR1cm4gdjEuY3Jvc3ModjIpLmxlbmd0aCgpIDwgZXBzICYmIFZlY3RvcjMuRG90KHYxLCB2MikgPiAwO1xufVxuXG4vKipcbiAqIFRlc3Qgd2hldGhlciB0d28gcXVhdGVybmlvbnMgaGF2ZSBlcXVhbCBlZmZlY3RzXG4gKiBAcGFyYW0gcTEgSW5wdXQgcXVhdGVybmlvbiAxXG4gKiBAcGFyYW0gcTIgSW5wdXQgcXVhdGVybmlvbiAyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UXVhdGVybmlvbkVxdWFsc0J5VmVjdG9yKHExOiBRdWF0ZXJuaW9uLCBxMjogUXVhdGVybmlvbikge1xuICAgIGNvbnN0IHRlc3RWZWMgPSBWZWN0b3IzLk9uZSgpO1xuICAgIGNvbnN0IHRlc3RWZWMxID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgY29uc3QgdGVzdFZlYzIgPSBWZWN0b3IzLk9uZSgpO1xuICAgIHRlc3RWZWMucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYocTEsIHRlc3RWZWMxKTtcbiAgICB0ZXN0VmVjLnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKHEyLCB0ZXN0VmVjMik7XG4gICAgcmV0dXJuIHZlY3RvcnNTYW1lRGlyV2l0aGluRXBzKHRlc3RWZWMxLCB0ZXN0VmVjMik7XG59XG5cbi8qKlxuICogU2FtZSBhcyBhYm92ZSwgRXVsZXIgYW5nbGUgdmVyc2lvblxuICogQHBhcmFtIGQxIElucHV0IGRlZ3JlZXMgMVxuICogQHBhcmFtIGQyIElucHV0IGRlZ3JlZXMgMlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVncmVlc0VxdWFsSW5RdWF0ZXJuaW9uKFxuICAgIGQxOiBWZWN0b3IzLCBkMjogVmVjdG9yM1xuKSB7XG4gICAgY29uc3QgcTEgPSBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcyhEZWdUb1JhZChkMS54KSwgRGVnVG9SYWQoZDEueSksIERlZ1RvUmFkKGQxLnopKTtcbiAgICBjb25zdCBxMiA9IFF1YXRlcm5pb24uRnJvbUV1bGVyQW5nbGVzKERlZ1RvUmFkKGQyLngpLCBEZWdUb1JhZChkMi55KSwgRGVnVG9SYWQoZDIueikpO1xuICAgIHJldHVybiB0ZXN0UXVhdGVybmlvbkVxdWFsc0J5VmVjdG9yKHExLCBxMik7XG59XG5cbi8qKlxuICogUmV2ZXJzZSByb3RhdGlvbiBFdWxlciBhbmdsZXMgb24gZ2l2ZW4gYXhlc1xuICogQHBhcmFtIHEgSW5wdXQgcXVhdGVybmlvblxuICogQHBhcmFtIGF4aXMgQXhlcyB0byByZXZlcnNlXG4gKi9cbmV4cG9ydCBjb25zdCByZXZlcnNlUm90YXRpb24gPSAocTogUXVhdGVybmlvbiwgYXhpczogQVhJUykgPT4ge1xuICAgIGlmIChheGlzID09PSBBWElTLm5vbmUpIHJldHVybiBxO1xuICAgIGNvbnN0IGFuZ2xlcyA9IHEudG9FdWxlckFuZ2xlcygpO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgICBjYXNlIEFYSVMueDpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gLWFuZ2xlcy54O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy55OlxuICAgICAgICAgICAgYW5nbGVzLnkgPSAtYW5nbGVzLnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLno6XG4gICAgICAgICAgICBhbmdsZXMueiA9IC1hbmdsZXMuejtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueHk6XG4gICAgICAgICAgICBhbmdsZXMueCA9IC1hbmdsZXMueDtcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gLWFuZ2xlcy55O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy55ejpcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gLWFuZ2xlcy55O1xuICAgICAgICAgICAgYW5nbGVzLnogPSAtYW5nbGVzLno7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh6OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAtYW5nbGVzLng7XG4gICAgICAgICAgICBhbmdsZXMueiA9IC1hbmdsZXMuejtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueHl6OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAtYW5nbGVzLng7XG4gICAgICAgICAgICBhbmdsZXMueSA9IC1hbmdsZXMueTtcbiAgICAgICAgICAgIGFuZ2xlcy56ID0gLWFuZ2xlcy56O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlVua25vd24gYXhpcyFcIik7XG4gICAgfVxuICAgIHJldHVybiBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKGFuZ2xlcy55LCBhbmdsZXMueCwgYW5nbGVzLnopO1xufVxuLyoqXG4gKiBSZW1vdmUgcm90YXRpb24gb24gZ2l2ZW4gYXhlcy5cbiAqIE9wdGlvbmFsbHkgY2FwcGluZyByb3RhdGlvbiAoaW4gRXVsZXIgYW5nbGVzKSBvbiB0d28gYXhlcy5cbiAqIFRoaXMgb3BlcmF0aW9uIGFzc3VtZXMgcmUtbWFwcGVkIGRlZ3JlZXMuXG4gKiBAcGFyYW0gcSBJbnB1dCBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0gYXhpcyBBeGVzIHRvIHJlbW92ZVxuICogQHBhcmFtIGNhcEF4aXMxIENhcHBpbmcgYXhpcyAxXG4gKiBAcGFyYW0gY2FwTG93MSBBeGlzIDEgbG93ZXIgcmFuZ2VcbiAqIEBwYXJhbSBjYXBIaWdoMSBBeGlzIDEgaGlnaGVyIHJhbmdlXG4gKiBAcGFyYW0gY2FwQXhpczIgQ2FwcGluZyBheGlzIDJcbiAqIEBwYXJhbSBjYXBMb3cyIEF4aXMgMiBsb3dlciByYW5nZVxuICogQHBhcmFtIGNhcEhpZ2gyIEF4aXMgMiBoaWdoZXIgcmFuZ2VcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZVJvdGF0aW9uQXhpc1dpdGhDYXAgPSAoXG4gICAgcTogUXVhdGVybmlvbixcbiAgICBheGlzOiBBWElTLFxuICAgIGNhcEF4aXMxPzogQVhJUyxcbiAgICBjYXBMb3cxPzogbnVtYmVyLFxuICAgIGNhcEhpZ2gxPzogbnVtYmVyLFxuICAgIGNhcEF4aXMyPzogQVhJUyxcbiAgICBjYXBMb3cyPzogbnVtYmVyLFxuICAgIGNhcEhpZ2gyPzogbnVtYmVyLFxuKSA9PiB7XG4gICAgY29uc3QgYW5nbGVzID0gcXVhdGVybmlvblRvRGVncmVlcyhxLCB0cnVlKTtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgICAgY2FzZSBBWElTLm5vbmU6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLng6XG4gICAgICAgICAgICBhbmdsZXMueCA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnk6XG4gICAgICAgICAgICBhbmdsZXMueSA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLno6XG4gICAgICAgICAgICBhbmdsZXMueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh5OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAwO1xuICAgICAgICAgICAgYW5nbGVzLnkgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy55ejpcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gMDtcbiAgICAgICAgICAgIGFuZ2xlcy56ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueHo6XG4gICAgICAgICAgICBhbmdsZXMueCA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh5ejpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gMDtcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gMDtcbiAgICAgICAgICAgIGFuZ2xlcy56ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGF4aXMhXCIpO1xuICAgIH1cbiAgICBpZiAoY2FwQXhpczEgIT09IHVuZGVmaW5lZCAmJiBjYXBMb3cxICE9PSB1bmRlZmluZWQgJiYgY2FwSGlnaDEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzd2l0Y2ggKGNhcEF4aXMxIGFzIEFYSVMpIHtcbiAgICAgICAgICAgIGNhc2UgQVhJUy54OlxuICAgICAgICAgICAgICAgIGFuZ2xlcy54ID0gcmFuZ2VDYXAoYW5nbGVzLngsIGNhcExvdzEsIGNhcEhpZ2gxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy55OlxuICAgICAgICAgICAgICAgIGFuZ2xlcy55ID0gcmFuZ2VDYXAoYW5nbGVzLnksIGNhcExvdzEsIGNhcEhpZ2gxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgICAgIGFuZ2xlcy56ID0gcmFuZ2VDYXAoYW5nbGVzLnosIGNhcExvdzEsIGNhcEhpZ2gxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGNhcCBheGlzIVwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2FwQXhpczIgIT09IHVuZGVmaW5lZCAmJiBjYXBMb3cyICE9PSB1bmRlZmluZWQgJiYgY2FwSGlnaDIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzd2l0Y2ggKGNhcEF4aXMyIGFzIEFYSVMpIHtcbiAgICAgICAgICAgIGNhc2UgQVhJUy54OlxuICAgICAgICAgICAgICAgIGFuZ2xlcy54ID0gcmFuZ2VDYXAoYW5nbGVzLngsIGNhcExvdzIsIGNhcEhpZ2gyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy55OlxuICAgICAgICAgICAgICAgIGFuZ2xlcy55ID0gcmFuZ2VDYXAoYW5nbGVzLnksIGNhcExvdzIsIGNhcEhpZ2gyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgICAgIGFuZ2xlcy56ID0gcmFuZ2VDYXAoYW5nbGVzLnosIGNhcExvdzIsIGNhcEhpZ2gyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGNhcCBheGlzIVwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbChcbiAgICAgICAgRGVnVG9SYWQoYW5nbGVzLnkpLFxuICAgICAgICBEZWdUb1JhZChhbmdsZXMueCksXG4gICAgICAgIERlZ1RvUmFkKGFuZ2xlcy56KSk7XG59XG4vKipcbiAqIFN3aXRjaCByb3RhdGlvbiBheGVzLlxuICogQHBhcmFtIHEgSW5wdXQgcXVhdGVybmlvblxuICogQHBhcmFtIGF4aXMxIEF4aXMgMSB0byBzd2l0Y2hcbiAqIEBwYXJhbSBheGlzMiBBeGlzIDIgdG8gc3dpdGNoXG4gKi9cbmV4cG9ydCBjb25zdCBleGNoYW5nZVJvdGF0aW9uQXhpcyA9IChcbiAgICBxOiBRdWF0ZXJuaW9uLFxuICAgIGF4aXMxOiBBWElTLFxuICAgIGF4aXMyOiBBWElTLFxuKSA9PiB7XG4gICAgY29uc3QgYW5nbGVzOiBudW1iZXJbXSA9IFtdO1xuICAgIHEudG9FdWxlckFuZ2xlcygpLnRvQXJyYXkoYW5nbGVzKTtcbiAgICBjb25zdCBhbmdsZTEgPSBhbmdsZXNbYXhpczFdO1xuICAgIGNvbnN0IGFuZ2xlMiA9IGFuZ2xlc1theGlzMl07XG4gICAgY29uc3QgdGVtcCA9IGFuZ2xlMTtcbiAgICBhbmdsZXNbYXhpczFdID0gYW5nbGUyO1xuICAgIGFuZ2xlc1theGlzMl0gPSB0ZW1wO1xuICAgIHJldHVybiBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcyhcbiAgICAgICAgYW5nbGVzWzBdLFxuICAgICAgICBhbmdsZXNbMV0sXG4gICAgICAgIGFuZ2xlc1syXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmludFF1YXRlcm5pb24ocTogUXVhdGVybmlvbiwgcz86IHN0cmluZykge1xuICAgIGNvbnNvbGUubG9nKHMsIHZlY3RvclRvTm9ybWFsaXplZExhbmRtYXJrKHF1YXRlcm5pb25Ub0RlZ3JlZXMocSwgdHJ1ZSkpKTtcbn1cblxuXG4vKipcbiAqIFJlc3VsdCBpcyBpbiBSYWRpYW4gb24gdW5pdCBzcGhlcmUgKHIgPSAxKS5cbiAqIENhbm9uaWNhbCBJU08gODAwMDAtMjoyMDE5IGNvbnZlbnRpb24uXG4gKiBAcGFyYW0gcG9zIEV1Y2xpZGVhbiBsb2NhbCBwb3NpdGlvblxuICogQHBhcmFtIGJhc2lzIExvY2FsIGNvb3JkaW5hdGUgc3lzdGVtIGJhc2lzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjU3BoZXJpY2FsQ29vcmQoXG4gICAgcG9zOiBWZWN0b3IzLCBiYXNpczogQmFzaXMsXG4pIHtcbiAgICBjb25zdCBxVG9PcmlnaW5hbCA9IFF1YXRlcm5pb24uSW52ZXJzZShRdWF0ZXJuaW9uLlJvdGF0aW9uUXVhdGVybmlvbkZyb21BeGlzKFxuICAgICAgICBiYXNpcy54LmNsb25lKCksIGJhc2lzLnkuY2xvbmUoKSwgYmFzaXMuei5jbG9uZSgpKSkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgcG9zSW5PcmlnaW5hbCA9IFZlY3RvcjMuWmVybygpO1xuICAgIHBvcy5yb3RhdGVCeVF1YXRlcm5pb25Ub1JlZihxVG9PcmlnaW5hbCwgcG9zSW5PcmlnaW5hbCk7XG4gICAgcG9zSW5PcmlnaW5hbC5ub3JtYWxpemUoKTtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGV0YSBhbmQgcGhpXG4gICAgY29uc3QgeCA9IHBvc0luT3JpZ2luYWwueDtcbiAgICBjb25zdCB5ID0gcG9zSW5PcmlnaW5hbC55O1xuICAgIGNvbnN0IHogPSBwb3NJbk9yaWdpbmFsLno7XG5cbiAgICBjb25zdCB0aGV0YSA9IE1hdGguYWNvcyh6KTtcbiAgICBjb25zdCBwaGkgPSBNYXRoLmF0YW4yKHksIHgpO1xuXG4gICAgcmV0dXJuIFt0aGV0YSwgcGhpXTtcbn1cblxuLyoqXG4gKiBBc3N1bWluZyByb3RhdGlvbiBzdGFydHMgZnJvbSAoMSwgMCwgMCkgaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gKiBAcGFyYW0gYmFzaXMgTG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0gYmFzaXNcbiAqIEBwYXJhbSB0aGV0YSBQb2xhciBhbmdsZVxuICogQHBhcmFtIHBoaSBBemltdXRoYWwgYW5nbGVcbiAqIEBwYXJhbSBwcmV2UXVhdGVybmlvbiBQYXJlbnQgcXVhdGVybmlvbiB0byB0aGUgbG9jYWwgc3lzdGVtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgYmFzaXM6IEJhc2lzLCB0aGV0YTogbnVtYmVyLCBwaGk6IG51bWJlcixcbiAgICBwcmV2UXVhdGVybmlvbjogUXVhdGVybmlvbikge1xuICAgIGNvbnN0IHhUeiA9IFF1YXRlcm5pb24uUm90YXRpb25BeGlzKGJhc2lzLnkuY2xvbmUoKSwgLU1hdGguUEkgLyAyKTtcbiAgICBjb25zdCB4VHpCYXNpcyA9IGJhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbih4VHopO1xuICAgIGNvbnN0IHExID0gUXVhdGVybmlvbi5Sb3RhdGlvbkF4aXMoeFR6QmFzaXMueC5jbG9uZSgpLCBwaGkpO1xuICAgIGNvbnN0IHExQmFzaXMgPSB4VHpCYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24ocTEpO1xuICAgIGNvbnN0IHEyID0gUXVhdGVybmlvbi5Sb3RhdGlvbkF4aXMocTFCYXNpcy55LmNsb25lKCksIHRoZXRhKTtcbiAgICBjb25zdCBxMkJhc2lzID0gcTFCYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24ocTIpO1xuXG4gICAgLy8gRm9yY2UgcmVzdWx0IHRvIGZhY2UgZnJvbnRcbiAgICBjb25zdCBwbGFuZVhaID0gUGxhbmUuRnJvbVBvc2l0aW9uQW5kTm9ybWFsKFZlY3RvcjMuWmVybygpLCBiYXNpcy55LmNsb25lKCkpO1xuICAgIC8vIGNvbnN0IGludGVybUJhc2lzID0gYmFzaXMucm90YXRlQnlRdWF0ZXJuaW9uKHhUei5tdWx0aXBseShxMSkubXVsdGlwbHlJblBsYWNlKHEyKSk7XG4gICAgY29uc3QgaW50ZXJtQmFzaXMgPSBxMkJhc2lzO1xuICAgIGNvbnN0IG5ld0Jhc2lzWiA9IFZlY3RvcjMuQ3Jvc3MoaW50ZXJtQmFzaXMueC5jbG9uZSgpLCBwbGFuZVhaLm5vcm1hbCk7XG4gICAgY29uc3QgbmV3QmFzaXNZID0gVmVjdG9yMy5Dcm9zcyhuZXdCYXNpc1osIGludGVybUJhc2lzLnguY2xvbmUoKSk7XG4gICAgY29uc3QgbmV3QmFzaXMgPSBuZXcgQmFzaXMoW2ludGVybUJhc2lzLngsIG5ld0Jhc2lzWSwgbmV3QmFzaXNaXSk7XG5cbiAgICByZXR1cm4gcXVhdGVybmlvbkJldHdlZW5CYXNlcyhiYXNpcywgbmV3QmFzaXMsIHByZXZRdWF0ZXJuaW9uKTtcbn1cblxuLy8gU2NhbGUgcm90YXRpb24gYW5nbGVzIGluIHBsYWNlXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVSb3RhdGlvbihxdWF0ZXJuaW9uOiBRdWF0ZXJuaW9uLCBzY2FsZTogbnVtYmVyKSB7XG4gICAgY29uc3QgYW5nbGVzID0gcXVhdGVybmlvbi50b0V1bGVyQW5nbGVzKCk7XG4gICAgYW5nbGVzLnNjYWxlSW5QbGFjZShzY2FsZSk7XG4gICAgcmV0dXJuIFF1YXRlcm5pb24uRnJvbUV1bGVyVmVjdG9yKGFuZ2xlcyk7XG59XG4iLCIvKlxuQ29weXJpZ2h0IChDKSAyMDIxICBUaGUgdjNkIEF1dGhvcnMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIHZlcnNpb24gMy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7UGxhbmUsIFZlY3RvcjMsIEN1cnZlMywgSUxvYWRpbmdTY3JlZW59IGZyb20gXCJAYmFieWxvbmpzL2NvcmVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRBcnJheTxUPihsZW5ndGg6IG51bWJlciwgaW5pdGlhbGl6ZXI6IChpOiBudW1iZXIpID0+IFQpIHtcbiAgICBsZXQgYXJyID0gbmV3IEFycmF5PFQ+KGxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKylcbiAgICAgICAgYXJyW2ldID0gaW5pdGlhbGl6ZXIoaSk7XG4gICAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAge2xlbmd0aDogTWF0aC5jZWlsKChlbmQgLSBzdGFydCkgLyBzdGVwKX0sXG4gICAgICAgIChfLCBpKSA9PiBzdGFydCArIGkgKiBzdGVwXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpbnNwYWNlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkaXY6IG51bWJlcikge1xuICAgIGNvbnN0IHN0ZXAgPSAoZW5kIC0gc3RhcnQpIC8gZGl2O1xuICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICB7bGVuZ3RoOiBkaXZ9LFxuICAgICAgICAoXywgaSkgPT4gc3RhcnQgKyBpICogc3RlcFxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3RGbGlwKG9iajogYW55KSB7XG4gICAgY29uc3QgcmV0OiBhbnkgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGtleTogYW55KSA9PiB7XG4gICAgICAgIHJldFtvYmpba2V5XV0gPSBrZXk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGNvbnN0IHJhbmdlQ2FwID0gKFxuICAgIHY6IG51bWJlcixcbiAgICBtaW46IG51bWJlcixcbiAgICBtYXg6IG51bWJlclxuKSA9PiB7XG4gICAgaWYgKG1pbiA+IG1heCkge1xuICAgICAgICBjb25zdCB0bXAgPSBtYXg7XG4gICAgICAgIG1heCA9IG1pbjtcbiAgICAgICAgbWluID0gdG1wO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odiwgbWF4KSwgbWluKTtcbn1cbmV4cG9ydCBjb25zdCByZW1hcFJhbmdlID0gKFxuICAgIHY6IG51bWJlcixcbiAgICBzcmNfbG93OiBudW1iZXIsXG4gICAgc3JjX2hpZ2g6IG51bWJlcixcbiAgICBkc3RfbG93OiBudW1iZXIsXG4gICAgZHN0X2hpZ2g6IG51bWJlclxuKSA9PiB7XG4gICAgcmV0dXJuIGRzdF9sb3cgKyAodiAtIHNyY19sb3cpICogKGRzdF9oaWdoIC0gZHN0X2xvdykgLyAoc3JjX2hpZ2ggLSBzcmNfbG93KTtcbn07XG5leHBvcnQgY29uc3QgcmVtYXBSYW5nZVdpdGhDYXAgPSAoXG4gICAgdjogbnVtYmVyLFxuICAgIHNyY19sb3c6IG51bWJlcixcbiAgICBzcmNfaGlnaDogbnVtYmVyLFxuICAgIGRzdF9sb3c6IG51bWJlcixcbiAgICBkc3RfaGlnaDogbnVtYmVyXG4pID0+IHtcbiAgICBjb25zdCB2MSA9IHJhbmdlQ2FwKHYsIHNyY19sb3csIHNyY19oaWdoKTtcbiAgICByZXR1cm4gZHN0X2xvdyArICh2MSAtIHNyY19sb3cpICogKGRzdF9oaWdoIC0gZHN0X2xvdykgLyAoc3JjX2hpZ2ggLSBzcmNfbG93KTtcbn07XG5leHBvcnQgY29uc3QgcmVtYXBSYW5nZU5vQ2FwID0gKFxuICAgIHY6IG51bWJlcixcbiAgICBzcmNfbG93OiBudW1iZXIsXG4gICAgc3JjX2hpZ2g6IG51bWJlcixcbiAgICBkc3RfbG93OiBudW1iZXIsXG4gICAgZHN0X2hpZ2g6IG51bWJlclxuKSA9PiB7XG4gICAgcmV0dXJuIGRzdF9sb3cgKyAodiAtIHNyY19sb3cpICogKGRzdF9oaWdoIC0gZHN0X2xvdykgLyAoc3JjX2hpZ2ggLSBzcmNfbG93KTtcbn07XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRWZWN0b3IzKHY6IFZlY3RvcjMpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKHYueCkgJiYgTnVtYmVyLmlzRmluaXRlKHYueSkgJiYgTnVtYmVyLmlzRmluaXRlKHYueik7XG59XG5cbmV4cG9ydCB0eXBlIEtleXNNYXRjaGluZzxULCBWPiA9IHsgW0sgaW4ga2V5b2YgVF0tPzogVFtLXSBleHRlbmRzIFYgPyBLIDogbmV2ZXIgfVtrZXlvZiBUXTtcblxuLy8gdHlwZSBNZXRob2RLZXlzT2ZBID0gS2V5c01hdGNoaW5nPEEsIEZ1bmN0aW9uPjtcblxuZXhwb3J0IHR5cGUgSWZFcXVhbHM8WCwgWSwgQSA9IFgsIEIgPSBuZXZlcj4gPVxuICAgICg8VD4oKSA9PiBUIGV4dGVuZHMgWCA/IDEgOiAyKSBleHRlbmRzICg8VD4oKSA9PiBUIGV4dGVuZHMgWSA/IDEgOiAyKSA/IEEgOiBCO1xuZXhwb3J0IHR5cGUgUmVhZG9ubHlLZXlzPFQ+ID0ge1xuICAgIFtQIGluIGtleW9mIFRdLT86IElmRXF1YWxzPHsgW1EgaW4gUF06IFRbUF0gfSwgeyAtcmVhZG9ubHkgW1EgaW4gUF06IFRbUF0gfSwgbmV2ZXIsIFA+XG59W2tleW9mIFRdO1xuXG4vLyB0eXBlIFJlYWRvbmx5S2V5c09mQSA9IFJlYWRvbmx5S2V5czxBPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEVxdWFsPFQ+KGFzOiBTZXQ8VD4sIGJzOiBTZXQ8VD4pIHtcbiAgICBpZiAoYXMuc2l6ZSAhPT0gYnMuc2l6ZSkgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcykgaWYgKCFicy5oYXMoYSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2plY3RWZWN0b3JPblBsYW5lKHByb2pQbGFuZTogUGxhbmUsIHZlYzogVmVjdG9yMykge1xuICAgIHJldHVybiB2ZWMuc3VidHJhY3QocHJvalBsYW5lLm5vcm1hbC5zY2FsZShWZWN0b3IzLkRvdCh2ZWMsIHByb2pQbGFuZS5ub3JtYWwpKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByb3VuZCh2YWx1ZTogbnVtYmVyLCBwcmVjaXNpb246IG51bWJlcikge1xuICAgIGNvbnN0IG11bHRpcGxpZXIgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDApO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogbXVsdGlwbGllcikgLyBtdWx0aXBsaWVyO1xufVxuXG4vKipcbiAqIFNpbXBsZSBmaXhlZCBsZW5ndGggRklGTyBxdWV1ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIGZpeGVkTGVuZ3RoUXVldWU8VD4ge1xuICAgIHByaXZhdGUgX3ZhbHVlczogVFtdID0gW107XG4gICAgZ2V0IHZhbHVlcygpOiBUW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzaXplOiBudW1iZXIpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVzaCh2OiBUKSB7XG4gICAgICAgIHRoaXMudmFsdWVzLnB1c2godik7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gdGhpcy5zaXplICsgMSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZXMuc2hpZnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPiB0aGlzLnNpemUgKyAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEludGVybmFsIHF1ZXVlIGhhcyBsZW5ndGggbG9uZ2VyIHRoYW4gc2l6ZSAke3RoaXMuc2l6ZX06IEdvdCBsZW5ndGggJHt0aGlzLnZhbHVlcy5sZW5ndGh9YCk7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSB0aGlzLnZhbHVlcy5zbGljZSgtdGhpcy5zaXplKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb25jYXQoYXJyOiBUW10pIHtcbiAgICAgICAgdGhpcy5fdmFsdWVzID0gdGhpcy52YWx1ZXMuY29uY2F0KGFycik7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCA+IHRoaXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gdGhpcy52YWx1ZXMuc2xpY2UoLXRoaXMuc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcG9wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmlyc3QoKSB7XG4gICAgICAgIGlmICh0aGlzLl92YWx1ZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlc1swXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIGxhc3QoKSB7XG4gICAgICAgIGlmICh0aGlzLl92YWx1ZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZXNbdGhpcy5fdmFsdWVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMudmFsdWVzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmxlbmd0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUG9pbnQoY3VydmU6IEN1cnZlMywgeDogbnVtYmVyLCBlcHMgPSAwLjAwMSkge1xuICAgIGNvbnN0IHB0cyA9IGN1cnZlLmdldFBvaW50cygpO1xuICAgIGlmICh4ID4gcHRzWzBdLngpIHJldHVybiBwdHNbMF0ueTtcbiAgICBlbHNlIGlmICh4IDwgcHRzW3B0cy5sZW5ndGggLSAxXS54KSByZXR1cm4gcHRzW3B0cy5sZW5ndGggLSAxXS55O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyh4IC0gcHRzW2ldLngpIDwgZXBzKSByZXR1cm4gcHRzW2ldLnk7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuXG5leHBvcnQgY29uc3QgTFIgPSBbXCJsZWZ0XCIsIFwicmlnaHRcIl07XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21Mb2FkaW5nU2NyZWVuIGltcGxlbWVudHMgSUxvYWRpbmdTY3JlZW4ge1xuICAgIC8vb3B0aW9uYWwsIGJ1dCBuZWVkZWQgZHVlIHRvIGludGVyZmFjZSBkZWZpbml0aW9uc1xuICAgIHB1YmxpYyBsb2FkaW5nVUlCYWNrZ3JvdW5kQ29sb3I6IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyBsb2FkaW5nVUlUZXh0OiBzdHJpbmcgPSAnJztcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmluZ0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgbG9hZGluZ0RpdjogSFRNTERpdkVsZW1lbnRcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgZGlzcGxheUxvYWRpbmdVSSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxvYWRpbmdEaXYpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZ0Rpdi5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHtcbiAgICAgICAgICAgIC8vIERvIG5vdCBhZGQgYSBsb2FkaW5nIHNjcmVlbiBpZiB0aGVyZSBpcyBhbHJlYWR5IG9uZVxuICAgICAgICAgICAgdGhpcy5sb2FkaW5nRGl2LnN0eWxlLmRpc3BsYXkgPSBcImluaXRpYWxcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMuX3Jlc2l6ZUxvYWRpbmdVSSgpO1xuICAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLl9yZXNpemVMb2FkaW5nVUkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaWRlTG9hZGluZ1VJKCkge1xuICAgICAgICBpZiAodGhpcy5sb2FkaW5nRGl2KVxuICAgICAgICAgICAgdGhpcy5sb2FkaW5nRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlIF9yZXNpemVMb2FkaW5nVUkgPSAoKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLnJlbmRlcmluZ0NhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyAgICAgY29uc3QgY2FudmFzUG9zaXRpb25pbmcgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnJlbmRlcmluZ0NhbnZhcykucG9zaXRpb247XG4gICAgLy9cbiAgICAvLyAgICAgaWYgKCF0aGlzLl9sb2FkaW5nRGl2KSB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLnBvc2l0aW9uID0gKGNhbnZhc1Bvc2l0aW9uaW5nID09PSBcImZpeGVkXCIpID8gXCJmaXhlZFwiIDogXCJhYnNvbHV0ZVwiO1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLmxlZnQgPSBjYW52YXNSZWN0LmxlZnQgKyBcInB4XCI7XG4gICAgLy8gICAgIHRoaXMuX2xvYWRpbmdEaXYuc3R5bGUudG9wID0gY2FudmFzUmVjdC50b3AgKyBcInB4XCI7XG4gICAgLy8gICAgIHRoaXMuX2xvYWRpbmdEaXYuc3R5bGUud2lkdGggPSBjYW52YXNSZWN0LndpZHRoICsgXCJweFwiO1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLmhlaWdodCA9IGNhbnZhc1JlY3QuaGVpZ2h0ICsgXCJweFwiO1xuICAgIC8vIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50TGluZURpc3RhbmNlKFxuICAgIHBvaW50OiBWZWN0b3IzLFxuICAgIGxpbmVFbmRBOiBWZWN0b3IzLCBsaW5lRW5kQjogVmVjdG9yM1xuKSB7XG4gICAgY29uc3QgbGluZURpciA9IGxpbmVFbmRCLnN1YnRyYWN0KGxpbmVFbmRBKS5ub3JtYWxpemUoKTtcbiAgICBjb25zdCBwUHJvaiA9IGxpbmVFbmRBLmFkZChcbiAgICAgICAgbGluZURpci5zY2FsZShcbiAgICAgICAgICAgIFZlY3RvcjMuRG90KHBvaW50LnN1YnRyYWN0KGxpbmVFbmRBKSwgbGluZURpcilcbiAgICAgICAgICAgIC8gVmVjdG9yMy5Eb3QobGluZURpciwgbGluZURpcikpKTtcbiAgICByZXR1cm4gcG9pbnQuc3VidHJhY3QocFByb2opLmxlbmd0aCgpO1xufVxuIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMSAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBDb21saW5rIGZyb20gXCJjb21saW5rXCI7XG5pbXBvcnQge1xuICAgIEZBQ0VNRVNIX0ZBQ0VfT1ZBTCxcbiAgICBGQUNFTUVTSF9MRUZUX0VZRSxcbiAgICBGQUNFTUVTSF9MRUZUX0VZRUJST1csXG4gICAgRkFDRU1FU0hfTEVGVF9JUklTLFxuICAgIEZBQ0VNRVNIX0xJUFMsXG4gICAgRkFDRU1FU0hfUklHSFRfRVlFLFxuICAgIEZBQ0VNRVNIX1JJR0hUX0VZRUJST1csXG4gICAgRkFDRU1FU0hfUklHSFRfSVJJUyxcbiAgICBOb3JtYWxpemVkTGFuZG1hcmssXG4gICAgTm9ybWFsaXplZExhbmRtYXJrTGlzdCxcbiAgICBQT1NFX0xBTkRNQVJLUyxcbiAgICBQT1NFX0xBTkRNQVJLU19MRUZULFxuICAgIFBPU0VfTEFORE1BUktTX1JJR0hULFxufSBmcm9tIFwiQG1lZGlhcGlwZS9ob2xpc3RpY1wiO1xuaW1wb3J0IHsgTnVsbGFibGUsIFBsYW5lLCBRdWF0ZXJuaW9uLCBWZWN0b3IzIH0gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IHtcbiAgICBmaXhlZExlbmd0aFF1ZXVlLFxuICAgIGluaXRBcnJheSxcbiAgICBLZXlzTWF0Y2hpbmcsXG4gICAgTFIsXG4gICAgcG9pbnRMaW5lRGlzdGFuY2UsXG4gICAgcHJvamVjdFZlY3Rvck9uUGxhbmUsXG4gICAgUmVhZG9ubHlLZXlzLFxuICAgIHJlbWFwUmFuZ2UsXG4gICAgcmVtYXBSYW5nZU5vQ2FwLFxuICAgIHJlbWFwUmFuZ2VXaXRoQ2FwLFxufSBmcm9tIFwiLi4vaGVscGVyL3V0aWxzXCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUgfSBmcm9tIFwidjNkLWNvcmUtcmVhbGJpdHMvZGlzdC9zcmMvaW1wb3J0ZXIvYmFieWxvbi12cm0tbG9hZGVyL3NyY1wiO1xuaW1wb3J0IHtcbiAgICBDbG9uZWFibGVSZXN1bHRzLFxuICAgIGRlcHRoRmlyc3RTZWFyY2gsXG4gICAgRkFDRV9MQU5ETUFSS19MRU5HVEgsXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcixcbiAgICBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yMyxcbiAgICBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCxcbiAgICBIQU5EX0xBTkRNQVJLX0xFTkdUSCxcbiAgICBIQU5EX0xBTkRNQVJLUyxcbiAgICBIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkcsXG4gICAgaGFuZExhbmRNYXJrVG9Cb25lTmFtZSxcbiAgICBub3JtYWxpemVkTGFuZG1hcmtUb1ZlY3RvcixcbiAgICBQT1NFX0xBTkRNQVJLX0xFTkdUSCxcbiAgICB2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayxcbn0gZnJvbSBcIi4uL2hlbHBlci9sYW5kbWFya1wiO1xuaW1wb3J0IHtcbiAgICBBWElTLFxuICAgIGNhbGNTcGhlcmljYWxDb29yZCxcbiAgICBDbG9uZWFibGVRdWF0ZXJuaW9uLFxuICAgIENsb25lYWJsZVF1YXRlcm5pb25NYXAsXG4gICAgY2xvbmVhYmxlUXVhdGVybmlvblRvUXVhdGVybmlvbixcbiAgICBkZWdyZWVCZXR3ZWVuVmVjdG9ycyxcbiAgICBGaWx0ZXJlZFF1YXRlcm5pb24sXG4gICAgcmVtb3ZlUm90YXRpb25BeGlzV2l0aENhcCxcbiAgICByZXZlcnNlUm90YXRpb24sXG4gICAgc2NhbGVSb3RhdGlvbixcbiAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24sXG59IGZyb20gXCIuLi9oZWxwZXIvcXVhdGVybmlvblwiO1xuaW1wb3J0IHtcbiAgICBCYXNpcyxcbiAgICBjYWxjQXZnUGxhbmUsXG4gICAgZ2V0QmFzaXMsXG4gICAgcXVhdGVybmlvbkJldHdlZW5CYXNlcyxcbn0gZnJvbSBcIi4uL2hlbHBlci9iYXNpc1wiO1xuaW1wb3J0IHsgVklTSUJJTElUWV9USFJFU0hPTEQgfSBmcm9tIFwiLi4vaGVscGVyL2ZpbHRlclwiO1xuaW1wb3J0IHsgQm9uZU9wdGlvbnMgfSBmcm9tIFwiLi4vdjNkLXdlYlwiO1xuaW1wb3J0IHsgSHVtYW5vaWRCb25lIH0gZnJvbSBcInYzZC1jb3JlLXJlYWxiaXRzL2Rpc3Qvc3JjL2ltcG9ydGVyL2JhYnlsb24tdnJtLWxvYWRlci9zcmMvaHVtYW5vaWQtYm9uZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zZUtleVBvaW50cyB7XG4gICAgcHVibGljIHRvcF9mYWNlX292YWwgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2ZhY2Vfb3ZhbCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGJvdHRvbV9mYWNlX292YWwgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9mYWNlX292YWwgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2V5ZV90b3AgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2V5ZV9ib3R0b20gPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2V5ZV9pbm5lciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfZXllX291dGVyID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfaW5uZXJfc2Vjb25kYXJ5ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfb3V0ZXJfc2Vjb25kYXJ5ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9pcmlzX3RvcCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfaXJpc19ib3R0b20gPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2lyaXNfbGVmdCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfaXJpc19yaWdodCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV90b3AgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9leWVfYm90dG9tID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZXllX2lubmVyID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZXllX291dGVyID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZXllX2lubmVyX3NlY29uZGFyeSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9vdXRlcl9zZWNvbmRhcnkgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9pcmlzX3RvcCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2lyaXNfYm90dG9tID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfaXJpc19sZWZ0ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfaXJpc19yaWdodCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX3RvcF9maXJzdCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX3RvcF9zZWNvbmQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF90b3BfdGhpcmQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF9ib3R0b21fZmlyc3QgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF9ib3R0b21fc2Vjb25kID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfYm90dG9tX3RoaXJkID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfbGVmdCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX3JpZ2h0ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbn1cblxuZXhwb3J0IHR5cGUgUG9zZXNLZXkgPSBrZXlvZiBPbWl0PFxuICAgIFBvc2VzLFxuICAgIEtleXNNYXRjaGluZzxQb3NlcywgRnVuY3Rpb24+IHwgUmVhZG9ubHlLZXlzPFBvc2VzPlxuPjtcblxuZXhwb3J0IGNsYXNzIFBvc2VzIHtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEZBQ0VfTUVTSF9DT05ORUNUSU9OUyA9IFtcbiAgICAgICAgRkFDRU1FU0hfTEVGVF9FWUVCUk9XLFxuICAgICAgICBGQUNFTUVTSF9SSUdIVF9FWUVCUk9XLFxuICAgICAgICBGQUNFTUVTSF9MRUZUX0VZRSxcbiAgICAgICAgRkFDRU1FU0hfUklHSFRfRVlFLFxuICAgICAgICBGQUNFTUVTSF9MRUZUX0lSSVMsXG4gICAgICAgIEZBQ0VNRVNIX1JJR0hUX0lSSVMsXG4gICAgICAgIEZBQ0VNRVNIX0xJUFMsXG4gICAgICAgIEZBQ0VNRVNIX0ZBQ0VfT1ZBTCxcbiAgICBdO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSEFORF9CQVNFX1JPT1RfTk9STUFMID0gbmV3IFZlY3RvcjMoMCwgLTEsIDApO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSEFORF9QT1NJVElPTl9TQ0FMSU5HID0gMC44O1xuXG4gICAgLyogUmVtYXAgb2Zmc2V0cyB0byBxdWF0ZXJuaW9ucyB1c2luZyBhcmJpdHJhcnkgcmFuZ2UuXG4gICAgICogSVJJU19NUD1NZWRpYVBpcGUgSXJpc1xuICAgICAqIElSSVNfQkpTPUJhYnlsb25KUyBSb3RhdGlvbllhd1BpdGNoUm9sbFxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IElSSVNfTVBfWF9SQU5HRSA9IDAuMDI3O1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IElSSVNfTVBfWV9SQU5HRSA9IDAuMDExO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IElSSVNfQkpTX1hfUkFOR0UgPSAwLjI4O1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IElSSVNfQkpTX1lfUkFOR0UgPSAwLjEyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQkxJTktfUkFUSU9fTE9XID0gMC41OTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBCTElOS19SQVRJT19ISUdIID0gMC42MTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBNT1VUSF9NUF9SQU5HRV9MT1cgPSAwLjAwMTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBNT1VUSF9NUF9SQU5HRV9ISUdIID0gMC4wNjtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVZRV9XSURUSF9CQVNFTElORSA9IDAuMDU0NjtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBNT1VUSF9XSURUSF9CQVNFTElORSA9IDAuMDk1O1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IExSX0ZBQ0VfRElSRUNUSU9OX1JBTkdFID0gMjc7XG5cbiAgICAvLyBHZW5lcmFsXG4gICAgcHJpdmF0ZSBfYm9uZU9wdGlvbnM6IEJvbmVPcHRpb25zO1xuICAgIC8vIFdvcmthcm91bmQgZm9yIFByb21pc2UgcHJvYmxlbVxuICAgIHB1YmxpYyB1cGRhdGVCb25lT3B0aW9ucyh2YWx1ZTogQm9uZU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYm9uZU9wdGlvbnMgPSB2YWx1ZTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYm9uZVJvdGF0aW9uVXBkYXRlRm46IE51bGxhYmxlPFxuICAgICAgICAoKGRhdGE6IFVpbnQ4QXJyYXkpID0+IHZvaWQpICYgQ29tbGluay5Qcm94eU1hcmtlZFxuICAgID4gPSBudWxsO1xuXG4gICAgLy8gVlJNTWFuYWdlclxuICAgIHByaXZhdGUgYm9uZXNIaWVyYXJjaHlUcmVlOiBOdWxsYWJsZTxUcmFuc2Zvcm1Ob2RlVHJlZU5vZGU+ID0gbnVsbDtcblxuICAgIC8vIFJlc3VsdHNcbiAgICBwdWJsaWMgY2xvbmVhYmxlSW5wdXRSZXN1bHRzOiBOdWxsYWJsZTxDbG9uZWFibGVSZXN1bHRzPiA9IG51bGw7XG5cbiAgICAvLyBQb3NlIExhbmRtYXJrc1xuICAgIHB1YmxpYyBpbnB1dFBvc2VMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihQT1NFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIHBvc2VMYW5kbWFya3M6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PEZpbHRlcmVkTGFuZG1hcmtWZWN0b3I+KFBPU0VfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICAgICAgICAgIFI6IDAuMSxcbiAgICAgICAgICAgICAgICBROiA1LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiS2FsbWFuXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSB3b3JsZFBvc2VMYW5kbWFya3M6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PEZpbHRlcmVkTGFuZG1hcmtWZWN0b3I+KFBPU0VfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICAgICAgICAgIC8vIFI6IDAuMSwgUTogMC4xLCB0eXBlOiAnS2FsbWFuJyxcbiAgICAgICAgICAgICAgICBSOiAwLjEsXG4gICAgICAgICAgICAgICAgUTogMSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICAgICAgfSk7IC8vIDAuMDEsIDAuNiwgMC4wMDdcbiAgICAgICAgfSk7XG4gICAgLy8gQ2Fubm90IHVzZSBWZWN0b3IzIGRpcmVjdGx5IHNpbmNlIHBvc3RNZXNzYWdlKCkgZXJhc2VzIGFsbCBtZXRob2RzXG4gICAgcHVibGljIGNsb25lYWJsZVBvc2VMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihQT1NFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcblxuICAgIC8vIEZhY2UgTWVzaCBMYW5kbWFya3NcbiAgICBwdWJsaWMgaW5wdXRGYWNlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oRkFDRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSBmYWNlTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihGQUNFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAvLyBvbmVFdXJvQ3V0b2ZmOiAwLjAxLCBvbmVFdXJvQmV0YTogMTUsIHR5cGU6ICdPbmVFdXJvJyxcbiAgICAgICAgICAgICAgICBSOiAwLjEsXG4gICAgICAgICAgICAgICAgUTogMSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICAgICAgfSk7IC8vIDAuMDEsIDE1LCAwLjAwMlxuICAgICAgICB9KTtcbiAgICBwcml2YXRlIF9mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0OiBudW1iZXJbXVtdID0gW107XG4gICAgZ2V0IGZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3QoKTogbnVtYmVyW11bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2ZhY2VNZXNoTGFuZG1hcmtMaXN0OiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0W10gPSBbXTtcbiAgICBnZXQgZmFjZU1lc2hMYW5kbWFya0xpc3QoKTogTm9ybWFsaXplZExhbmRtYXJrTGlzdFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY2VNZXNoTGFuZG1hcmtMaXN0O1xuICAgIH1cblxuICAgIC8vIExlZnQgSGFuZCBMYW5kbWFya3NcbiAgICBwcml2YXRlIGxlZnRXcmlzdE9mZnNldDogRmlsdGVyZWRMYW5kbWFya1ZlY3RvciA9XG4gICAgICAgIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgIFI6IDAuMSxcbiAgICAgICAgICAgIFE6IDIsXG4gICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICB9KTsgLy8gMC4wMSwgMiwgMC4wMDhcbiAgICBwdWJsaWMgaW5wdXRMZWZ0SGFuZExhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEhBTkRfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgbGVmdEhhbmRMYW5kbWFya3M6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PEZpbHRlcmVkTGFuZG1hcmtWZWN0b3I+KEhBTkRfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICAgICAgICAgIFI6IDEsXG4gICAgICAgICAgICAgICAgUTogMTAsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgICAgIH0pOyAvLyAwLjAwMSwgMC42XG4gICAgICAgIH0pO1xuICAgIHB1YmxpYyBjbG9uZWFibGVMZWZ0SGFuZExhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEhBTkRfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgbGVmdEhhbmROb3JtYWw6IFZlY3RvcjMgPSBWZWN0b3IzLlplcm8oKTtcblxuICAgIC8vIFJpZ2h0IEhhbmQgTGFuZG1hcmtzXG4gICAgcHJpdmF0ZSByaWdodFdyaXN0T2Zmc2V0OiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yID1cbiAgICAgICAgbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICAgICAgUjogMC4xLFxuICAgICAgICAgICAgUTogMixcbiAgICAgICAgICAgIHR5cGU6IFwiS2FsbWFuXCIsXG4gICAgICAgIH0pOyAvLyAwLjAxLCAyLCAwLjAwOFxuICAgIHB1YmxpYyBpbnB1dFJpZ2h0SGFuZExhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEhBTkRfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgcmlnaHRIYW5kTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICBSOiAxLFxuICAgICAgICAgICAgICAgIFE6IDEwLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiS2FsbWFuXCIsXG4gICAgICAgICAgICB9KTsgLy8gMC4wMDEsIDAuNlxuICAgICAgICB9KTtcbiAgICBwdWJsaWMgY2xvbmVhYmxlUmlnaHRIYW5kTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oSEFORF9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSByaWdodEhhbmROb3JtYWw6IFZlY3RvcjMgPSBWZWN0b3IzLlplcm8oKTtcblxuICAgIC8vIEZlZXRcbiAgICBwcml2YXRlIGxlZnRGb290Tm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgcHJpdmF0ZSByaWdodEZvb3ROb3JtYWw6IFZlY3RvcjMgPSBWZWN0b3IzLlplcm8oKTtcbiAgICBwcml2YXRlIGxlZnRGb290QmFzaXNSb3RhdGlvbjogUXVhdGVybmlvbiA9IFF1YXRlcm5pb24uSWRlbnRpdHkoKTtcbiAgICBwcml2YXRlIHJpZ2h0Rm9vdEJhc2lzUm90YXRpb246IFF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLklkZW50aXR5KCk7XG5cbiAgICAvLyBLZXkgcG9pbnRzXG4gICAgcHJpdmF0ZSBfa2V5UG9pbnRzOiBQb3NlS2V5UG9pbnRzID0gbmV3IFBvc2VLZXlQb2ludHMoKTtcbiAgICBnZXQga2V5UG9pbnRzKCk6IFBvc2VLZXlQb2ludHMge1xuICAgICAgICByZXR1cm4gdGhpcy5fa2V5UG9pbnRzO1xuICAgIH1cbiAgICBwcml2YXRlIF9ibGlua0Jhc2U6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgIFI6IDEsXG4gICAgICAgIFE6IDEsXG4gICAgICAgIHR5cGU6IFwiS2FsbWFuXCIsXG4gICAgfSk7XG4gICAgcHJpdmF0ZSBfbGVmdEJsaW5rQXJyOiBmaXhlZExlbmd0aFF1ZXVlPG51bWJlcj4gPVxuICAgICAgICBuZXcgZml4ZWRMZW5ndGhRdWV1ZTxudW1iZXI+KDEwKTtcbiAgICBwcml2YXRlIF9yaWdodEJsaW5rQXJyOiBmaXhlZExlbmd0aFF1ZXVlPG51bWJlcj4gPVxuICAgICAgICBuZXcgZml4ZWRMZW5ndGhRdWV1ZTxudW1iZXI+KDEwKTtcblxuICAgIC8vIENhbGN1bGF0ZWQgcHJvcGVydGllc1xuICAgIHByaXZhdGUgX2ZhY2VOb3JtYWw6IE5vcm1hbGl6ZWRMYW5kbWFyayA9IHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgIGdldCBmYWNlTm9ybWFsKCk6IE5vcm1hbGl6ZWRMYW5kbWFyayB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mYWNlTm9ybWFsO1xuICAgIH1cbiAgICBwcml2YXRlIF9oZWFkUXVhdGVybmlvbjogRmlsdGVyZWRRdWF0ZXJuaW9uID0gbmV3IEZpbHRlcmVkUXVhdGVybmlvbih7XG4gICAgICAgIFI6IDEsXG4gICAgICAgIFE6IDUwLFxuICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogb3B0aW9uOiBsb2NrIHggcm90YXRpb25cblxuICAgIC8vIEEgY29weSBmb3IgcmVzdG9yZSBib25lIGxvY2F0aW9uc1xuICAgIHByaXZhdGUgX2luaXRCb25lUm90YXRpb25zOiBDbG9uZWFibGVRdWF0ZXJuaW9uTWFwID0ge307XG4gICAgLy8gQ2FsY3VsYXRlZCBib25lIHJvdGF0aW9uc1xuICAgIHByaXZhdGUgX2JvbmVSb3RhdGlvbnM6IENsb25lYWJsZVF1YXRlcm5pb25NYXAgPSB7fTtcbiAgICBwcml2YXRlIHRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG5cbiAgICBwcml2YXRlIF9sZWZ0SGFuZE5vcm1hbHM6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPigzLCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIGdldCBsZWZ0SGFuZE5vcm1hbHMoKTogTm9ybWFsaXplZExhbmRtYXJrTGlzdCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZWZ0SGFuZE5vcm1hbHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmlnaHRIYW5kTm9ybWFsczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KDMsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG4gICAgZ2V0IHJpZ2h0SGFuZE5vcm1hbHMoKTogTm9ybWFsaXplZExhbmRtYXJrTGlzdCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodEhhbmROb3JtYWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Bvc2VOb3JtYWxzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oXG4gICAgICAgICAgICAzLCAvLyBBcmJpdHJhcnkgbGVuZ3RoIGZvciBkZWJ1Z2dpbmdcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgZ2V0IHBvc2VOb3JtYWxzKCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zZU5vcm1hbHM7XG4gICAgfVxuXG4gICAgcHVibGljIG1pZEhpcFBvczogTnVsbGFibGU8Tm9ybWFsaXplZExhbmRtYXJrPiA9IG51bGw7XG4gICAgcHVibGljIG1pZEhpcEluaXRPZmZzZXQ6IE51bGxhYmxlPE5vcm1hbGl6ZWRMYW5kbWFyaz4gPSBudWxsO1xuICAgIHB1YmxpYyBtaWRIaXBPZmZzZXQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgIFI6IDEsXG4gICAgICAgIFE6IDEwLFxuICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgIH0pO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGJvbmVPcHRpb25zOiBCb25lT3B0aW9ucyxcbiAgICAgICAgYm9uZVJvdGF0aW9uVXBkYXRlRm4/OiAoKGRhdGE6IFVpbnQ4QXJyYXkpID0+IHZvaWQpICZcbiAgICAgICAgICAgIENvbWxpbmsuUHJveHlNYXJrZWRcbiAgICApIHtcbiAgICAgICAgdGhpcy5pbml0Qm9uZVJvdGF0aW9ucygpOyAvL3Byb3Zpc2lvbmFsXG4gICAgICAgIHRoaXMuX2JvbmVPcHRpb25zID0gYm9uZU9wdGlvbnM7XG4gICAgICAgIGlmIChib25lUm90YXRpb25VcGRhdGVGbilcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvblVwZGF0ZUZuID0gYm9uZVJvdGF0aW9uVXBkYXRlRm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25lIHRpbWUgb3BlcmF0aW9uIHRvIHNldCBib25lcyBoaWVyYXJjaHkgZnJvbSBWUk1NYW5hZ2VyXG4gICAgICogQHBhcmFtIHRyZWUgcm9vdCBub2RlIG9mIHRyZWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0Qm9uZXNIaWVyYXJjaHlUcmVlKFxuICAgICAgICB0cmVlOiBUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUsXG4gICAgICAgIGZvcmNlUmVwbGFjZSA9IGZhbHNlXG4gICAgKSB7XG4gICAgICAgIC8vIEFzc3VtZSBib25lcyBoYXZlIHVuaXF1ZSBuYW1lc1xuICAgICAgICBpZiAodGhpcy5ib25lc0hpZXJhcmNoeVRyZWUgJiYgIWZvcmNlUmVwbGFjZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYm9uZXNIaWVyYXJjaHlUcmVlID0gdHJlZTtcblxuICAgICAgICAvLyBSZS1pbml0IGJvbmUgcm90YXRpb25zXG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zID0ge307XG4gICAgICAgIGRlcHRoRmlyc3RTZWFyY2goXG4gICAgICAgICAgICB0aGlzLmJvbmVzSGllcmFyY2h5VHJlZSxcbiAgICAgICAgICAgIChuOiBUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tuLm5hbWVdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmluaXRCb25lUm90YXRpb25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxsIE1lZGlhUGlwZSBpbnB1dHMgaGF2ZSB0aGUgZm9sbG93aW5nIGNvbnZlbnRpb25zOlxuICAgICAqICAtIExlZnQtcmlnaHQgbWlycm9yZWQgKHNlbGZpZSBtb2RlKVxuICAgICAqICAtIEZhY2UgdG93YXJkcyAtWiAodG93YXJkcyBjYW1lcmEpIGJ5IGRlZmF1bHRcbiAgICAgKiAgVE9ETzogaW50ZXJwb2xhdGUgcmVzdWx0cyB0byA2MCBGUFMuXG4gICAgICogQHBhcmFtIHJlc3VsdHMgUmVzdWx0IG9iamVjdCBmcm9tIE1lZGlhUGlwZSBIb2xpc3RpY1xuICAgICAqL1xuICAgIHB1YmxpYyBwcm9jZXNzKHJlc3VsdHM6IENsb25lYWJsZVJlc3VsdHMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjYWxsIHByb2Nlc3MoKVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXN1bHRzOiBcIiwgcmVzdWx0cyk7XG5cbiAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHMgPSByZXN1bHRzO1xuICAgICAgICBpZiAoIXRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvbmVPcHRpb25zLnJlc2V0SW52aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0Qm9uZVJvdGF0aW9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmVQcm9jZXNzUmVzdWx0cygpO1xuXG4gICAgICAgIC8vIEFjdHVhbCBwcm9jZXNzaW5nXG4gICAgICAgIC8vIFBvc3QgZmlsdGVyZWQgbGFuZG1hcmtzXG4gICAgICAgIHRoaXMudG9DbG9uZWFibGVMYW5kbWFya3MoXG4gICAgICAgICAgICB0aGlzLnBvc2VMYW5kbWFya3MsXG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZVBvc2VMYW5kbWFya3NcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5maWx0ZXJGYWNlTGFuZG1hcmtzKCk7XG4gICAgICAgIHRoaXMudG9DbG9uZWFibGVMYW5kbWFya3MoXG4gICAgICAgICAgICB0aGlzLmxlZnRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVMZWZ0SGFuZExhbmRtYXJrc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLnRvQ2xvbmVhYmxlTGFuZG1hcmtzKFxuICAgICAgICAgICAgdGhpcy5yaWdodEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZVJpZ2h0SGFuZExhbmRtYXJrc1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIEdhdGhlciBrZXkgcG9pbnRzXG4gICAgICAgIHRoaXMuZ2V0S2V5UG9pbnRzKCk7XG5cbiAgICAgICAgLy8gQm9uZSBPcmllbnRhdGlvbnMgSW5kZXBlbmRlbnRcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGlyaXMgb3JpZW50YXRpb25zXG4gICAgICAgIHRoaXMuY2FsY0lyaXNOb3JtYWwoKTtcblxuICAgICAgICAvLyBCb25lIE9yaWVudGF0aW9ucyBEZXBlbmRlbnRcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGZhY2Ugb3JpZW50YXRpb25cbiAgICAgICAgdGhpcy5jYWxjRmFjZUJvbmVzKCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGV4cHJlc3Npb25zXG4gICAgICAgIHRoaXMuY2FsY0V4cHJlc3Npb25zKCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGZ1bGwgYm9keSBib25lc1xuICAgICAgICB0aGlzLmNhbGNQb3NlQm9uZXMoKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgaGFuZCBib25lc1xuICAgICAgICB0aGlzLmNhbGNIYW5kQm9uZXMoKTtcblxuICAgICAgICAvLyBQb3N0IHByb2Nlc3NpbmdcbiAgICAgICAgaWYgKHRoaXMuX2JvbmVPcHRpb25zLmlyaXNMb2NrWCkge1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImlyaXNcIl0uc2V0KFxuICAgICAgICAgICAgICAgIHJlbW92ZVJvdGF0aW9uQXhpc1dpdGhDYXAoXG4gICAgICAgICAgICAgICAgICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaXJpc1wiXVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBBWElTLnhcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImxlZnRJcmlzXCJdLnNldChcbiAgICAgICAgICAgICAgICByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImlyaXNcIl1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy54XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJyaWdodElyaXNcIl0uc2V0KFxuICAgICAgICAgICAgICAgIHJlbW92ZVJvdGF0aW9uQXhpc1dpdGhDYXAoXG4gICAgICAgICAgICAgICAgICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaXJpc1wiXVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBBWElTLnhcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbG9ja0JvbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAvLyBIb2xpc3RpYyBkb2Vzbid0IHJlc2V0IGhhbmQgbGFuZG1hcmtzIHdoZW4gaW52aXNpYmxlXG4gICAgICAgIC8vIFNvIHdlIGluZmVyIGludmlzaWJpbGl0eSBmcm9tIHdyaXN0IGxhbmRtYXJrXG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5yZXNldEludmlzaWJsZSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICh0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgUE9TRV9MQU5ETUFSS1MuTEVGVF9XUklTVFxuICAgICAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwKSA8IFZJU0lCSUxJVFlfVEhSRVNIT0xEXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgbGVmdCR7a31gO1xuICAgICAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAodGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTLlJJR0hUX1dSSVNUXG4gICAgICAgICAgICAgICAgXS52aXNpYmlsaXR5IHx8IDApIDwgVklTSUJJTElUWV9USFJFU0hPTERcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGByaWdodCR7a31gO1xuICAgICAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMubG9ja0Zpbmdlcikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkIG9mIExSKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKEhBTkRfTEFORE1BUktTX0JPTkVfTUFQUElORykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZCArIGs7XG4gICAgICAgICAgICAgICAgICAgIGxvY2tCb25lcy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5sb2NrQXJtKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgTFIpIHtcbiAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChgJHtrfVVwcGVyQXJtYCk7XG4gICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goYCR7a31Mb3dlckFybWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5sb2NrTGVnKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgTFIpIHtcbiAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChgJHtrfVVwcGVyTGVnYCk7XG4gICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goYCR7a31Mb3dlckxlZ2ApO1xuICAgICAgICAgICAgICAgIGxvY2tCb25lcy5wdXNoKGAke2t9Rm9vdGApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsdGVyQm9uZVJvdGF0aW9ucyhsb2NrQm9uZXMpO1xuXG4gICAgICAgIC8vIFB1c2ggdG8gbWFpblxuICAgICAgICB0aGlzLnB1c2hCb25lUm90YXRpb25CdWZmZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXRCb25lUm90YXRpb25zKHNlbmRSZXN1bHQgPSBmYWxzZSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyh0aGlzLl9pbml0Qm9uZVJvdGF0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNba10uc2V0KGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24odikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZW5kUmVzdWx0KSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hCb25lUm90YXRpb25CdWZmZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZmlsdGVyQm9uZVJvdGF0aW9ucyhib25lTmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBib25lTmFtZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ib25lUm90YXRpb25zW2tdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1trXS5zZXQoUXVhdGVybmlvbi5JZGVudGl0eSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0S2V5UG9pbnRzKCkge1xuICAgICAgICAvLyBHZXQgcG9pbnRzIGZyb20gZmFjZSBtZXNoXG4gICAgICAgIHRoaXMuX2tleVBvaW50cy50b3BfZmFjZV9vdmFsID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbN11bMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9mYWNlX292YWwgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs3XVs2XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5ib3R0b21fZmFjZV9vdmFsID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbN11bMThdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2ZhY2Vfb3ZhbCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzddWzMwXV07XG5cbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bOF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX2lubmVyID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bOF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfb3V0ZXIgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFsyXVswXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfb3V0ZXIgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFszXVswXV07XG5cbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2xlZnQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVsxMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfcmlnaHQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVswXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5tb3V0aF90b3BfZmlyc3QgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVsyNF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX3NlY29uZCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzZdWzI1XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5tb3V0aF90b3BfdGhpcmQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVsyNl1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfYm90dG9tX2ZpcnN0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMzRdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9zZWNvbmQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVszNV1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfYm90dG9tX3RoaXJkID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMzZdXTtcblxuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9pcmlzX3RvcCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzRdWzFdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc19ib3R0b20gPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVszXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfbGVmdCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzRdWzJdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc19yaWdodCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzRdWzBdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfdG9wID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNV1bMV1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19ib3R0b20gPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs1XVszXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX2xlZnQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs1XVsyXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3JpZ2h0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNV1bMF1dO1xuXG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV90b3AgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFsyXVsxMl1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bNF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfaW5uZXJfc2Vjb25kYXJ5ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bMTRdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyX3NlY29uZGFyeSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzEwXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfdG9wID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bMTJdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9ib3R0b20gPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFszXVs0XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfb3V0ZXJfc2Vjb25kYXJ5ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bMTBdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9pbm5lcl9zZWNvbmRhcnkgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFszXVsxNF1dO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2FsY3VsYXRlIHRoZSBmYWNlIG9yaWVudGF0aW9uIGZyb20gbGFuZG1hcmtzLlxuICAgICAqIExhbmRtYXJrcyBmcm9tIEZhY2UgTWVzaCB0YWtlcyBwcmVjZWRlbmNlLlxuICAgICAqL1xuICAgIHByaXZhdGUgY2FsY0ZhY2VCb25lcygpIHtcbiAgICAgICAgY29uc3QgYXhpc1ggPSB0aGlzLl9rZXlQb2ludHMubGVmdF9mYWNlX292YWwucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2ZhY2Vfb3ZhbC5wb3MpXG4gICAgICAgICAgICAubm9ybWFsaXplKCk7XG4gICAgICAgIGNvbnN0IGF4aXNZID0gdGhpcy5fa2V5UG9pbnRzLnRvcF9mYWNlX292YWwucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLmJvdHRvbV9mYWNlX292YWwucG9zKVxuICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICBpZiAoYXhpc1gubGVuZ3RoKCkgPT09IDAgfHwgYXhpc1kubGVuZ3RoKCkgPT09IDApIHJldHVybjtcbiAgICAgICAgY29uc3QgdGhpc0Jhc2lzID0gbmV3IEJhc2lzKFtcbiAgICAgICAgICAgIGF4aXNYLFxuICAgICAgICAgICAgYXhpc1ksXG4gICAgICAgICAgICBWZWN0b3IzLkNyb3NzKGF4aXNYLCBheGlzWSksXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIERpc3RyaWJ1dGUgcm90YXRpb24gYmV0d2VlbiBuZWNrIGFuZCBoZWFkXG4gICAgICAgIGNvbnN0IGhlYWRQYXJlbnRRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcImhlYWRcIiwgZmFsc2UpO1xuICAgICAgICBjb25zdCBoZWFkQmFzaXMgPVxuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImhlYWRcIl0ucm90YXRlQmFzaXMoaGVhZFBhcmVudFF1YXRlcm5pb24pO1xuICAgICAgICBjb25zdCBxdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgcXVhdGVybmlvbkJldHdlZW5CYXNlcyh0aGlzQmFzaXMsIGhlYWRCYXNpcywgaGVhZFBhcmVudFF1YXRlcm5pb24pLFxuICAgICAgICAgICAgQVhJUy54XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2hlYWRRdWF0ZXJuaW9uLnVwZGF0ZVJvdGF0aW9uKHF1YXRlcm5pb24pO1xuICAgICAgICBjb25zdCBzY2FsZWRRdWF0ZXJuaW9uID0gc2NhbGVSb3RhdGlvbih0aGlzLl9oZWFkUXVhdGVybmlvbi5yb3QsIDAuNSk7XG4gICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJoZWFkXCJdLnNldChzY2FsZWRRdWF0ZXJuaW9uKTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcIm5lY2tcIl0uc2V0KHNjYWxlZFF1YXRlcm5pb24pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmVtYXAgcG9zaXRpb25hbCBvZmZzZXRzIHRvIHJvdGF0aW9ucy5cbiAgICAgKiBJcmlzIG9ubHkgaGF2ZSBwb3NpdGlvbmFsIG9mZnNldHMuIFRoZWlyIG5vcm1hbHMgYWx3YXlzIGZhY2UgZnJvbnQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjYWxjSXJpc05vcm1hbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8uZmFjZUxhbmRtYXJrcykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxlZnRJcmlzQ2VudGVyID0gdGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc190b3AucG9zXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc19sZWZ0LnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc19yaWdodC5wb3MpXG4gICAgICAgICAgICAuc2NhbGUoMC41KTtcbiAgICAgICAgY29uc3QgcmlnaHRJcmlzQ2VudGVyID0gdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfdG9wLnBvc1xuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19ib3R0b20ucG9zKVxuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19sZWZ0LnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfcmlnaHQucG9zKVxuICAgICAgICAgICAgLnNjYWxlKDAuNSk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGV5ZSBjZW50ZXJcbiAgICAgICAgY29uc3QgbGVmdEV5ZUNlbnRlciA9IHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV90b3AucG9zXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9ib3R0b20ucG9zKVxuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfaW5uZXJfc2Vjb25kYXJ5LnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyX3NlY29uZGFyeS5wb3MpXG4gICAgICAgICAgICAuc2NhbGUoMC41KTtcbiAgICAgICAgY29uc3QgcmlnaHRFeWVDZW50ZXIgPSB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX3RvcC5wb3NcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9ib3R0b20ucG9zKVxuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyX3NlY29uZGFyeS5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfaW5uZXJfc2Vjb25kYXJ5LnBvcylcbiAgICAgICAgICAgIC5zY2FsZSgwLjUpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBvZmZzZXRzXG4gICAgICAgIGNvbnN0IGxlZnRFeWVXaWR0aCA9IHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9pbm5lci5wb3NcbiAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfb3V0ZXIucG9zKVxuICAgICAgICAgICAgLmxlbmd0aCgpO1xuICAgICAgICBjb25zdCByaWdodEV5ZVdpZHRoID0gdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9pbm5lci5wb3NcbiAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyLnBvcylcbiAgICAgICAgICAgIC5sZW5ndGgoKTtcblxuICAgICAgICBjb25zdCBsZWZ0SXJpc09mZnNldCA9IGxlZnRJcmlzQ2VudGVyXG4gICAgICAgICAgICAuc3VidHJhY3QobGVmdEV5ZUNlbnRlcilcbiAgICAgICAgICAgIC5zY2FsZShQb3Nlcy5FWUVfV0lEVEhfQkFTRUxJTkUgLyBsZWZ0RXllV2lkdGgpO1xuICAgICAgICBjb25zdCByaWdodElyaXNPZmZzZXQgPSByaWdodElyaXNDZW50ZXJcbiAgICAgICAgICAgIC5zdWJ0cmFjdChyaWdodEV5ZUNlbnRlcilcbiAgICAgICAgICAgIC5zY2FsZShQb3Nlcy5FWUVfV0lEVEhfQkFTRUxJTkUgLyByaWdodEV5ZVdpZHRoKTtcblxuICAgICAgICAvLyBSZW1hcCBvZmZzZXRzIHRvIHF1YXRlcm5pb25zXG4gICAgICAgIGNvbnN0IGxlZnRJcmlzUm90YXRpb25ZUFIgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKFxuICAgICAgICAgICAgcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAgICAgbGVmdElyaXNPZmZzZXQueCxcbiAgICAgICAgICAgICAgICAtUG9zZXMuSVJJU19NUF9YX1JBTkdFLFxuICAgICAgICAgICAgICAgIFBvc2VzLklSSVNfTVBfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICAtUG9zZXMuSVJJU19CSlNfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX0JKU19YX1JBTkdFXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAgICAgbGVmdElyaXNPZmZzZXQueSxcbiAgICAgICAgICAgICAgICAtUG9zZXMuSVJJU19NUF9ZX1JBTkdFLFxuICAgICAgICAgICAgICAgIFBvc2VzLklSSVNfTVBfWV9SQU5HRSxcbiAgICAgICAgICAgICAgICAtUG9zZXMuSVJJU19CSlNfWV9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX0JKU19ZX1JBTkdFXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgMFxuICAgICAgICApO1xuICAgICAgICBjb25zdCByaWdodElyaXNSb3RhdGlvbllQUiA9IFF1YXRlcm5pb24uUm90YXRpb25ZYXdQaXRjaFJvbGwoXG4gICAgICAgICAgICByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgICAgICByaWdodElyaXNPZmZzZXQueCxcbiAgICAgICAgICAgICAgICAtUG9zZXMuSVJJU19NUF9YX1JBTkdFLFxuICAgICAgICAgICAgICAgIFBvc2VzLklSSVNfTVBfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICAtUG9zZXMuSVJJU19CSlNfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX0JKU19YX1JBTkdFXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAgICAgcmlnaHRJcmlzT2Zmc2V0LnksXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWV9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWV9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wibGVmdElyaXNcIl0uc2V0KGxlZnRJcmlzUm90YXRpb25ZUFIpO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wicmlnaHRJcmlzXCJdLnNldChyaWdodElyaXNSb3RhdGlvbllQUik7XG4gICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJpcmlzXCJdLnNldChcbiAgICAgICAgICAgIHRoaXMubFJMaW5rUXVhdGVybmlvbihsZWZ0SXJpc1JvdGF0aW9uWVBSLCByaWdodElyaXNSb3RhdGlvbllQUilcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNFeHByZXNzaW9ucygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8uZmFjZUxhbmRtYXJrcykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGxlZnRUb3BUb01pZGRsZSA9IHBvaW50TGluZURpc3RhbmNlKFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX3RvcC5wb3MsXG4gICAgICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfaW5uZXIucG9zLFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyLnBvc1xuICAgICAgICApO1xuICAgICAgICBjb25zdCBsZWZ0VG9wVG9Cb3R0b20gPSB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfdG9wLnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9ib3R0b20ucG9zKVxuICAgICAgICAgICAgLmxlbmd0aCgpO1xuICAgICAgICBjb25zdCByaWdodFRvcFRvTWlkZGxlID0gcG9pbnRMaW5lRGlzdGFuY2UoXG4gICAgICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX3RvcC5wb3MsXG4gICAgICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX2lubmVyLnBvcyxcbiAgICAgICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfb3V0ZXIucG9zXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJpZ2h0VG9wVG9Cb3R0b20gPSB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX3RvcC5wb3NcbiAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX2JvdHRvbS5wb3MpXG4gICAgICAgICAgICAubGVuZ3RoKCk7XG5cbiAgICAgICAgdGhpcy5fYmxpbmtCYXNlLnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAgICAgTWF0aC5sb2cobGVmdFRvcFRvTWlkZGxlIC8gbGVmdFRvcFRvQm90dG9tICsgMSksXG4gICAgICAgICAgICAgICAgTWF0aC5sb2cocmlnaHRUb3BUb01pZGRsZSAvIHJpZ2h0VG9wVG9Cb3R0b20gKyAxKSxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGxldCBsZWZ0UmFuZ2VPZmZzZXQgPSAwO1xuICAgICAgICBpZiAodGhpcy5fbGVmdEJsaW5rQXJyLmxlbmd0aCgpID4gNCkge1xuICAgICAgICAgICAgbGVmdFJhbmdlT2Zmc2V0ID1cbiAgICAgICAgICAgICAgICB0aGlzLl9sZWZ0QmxpbmtBcnIudmFsdWVzLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgKHAsIGMsIGkpID0+IHAgKyAoYyAtIHApIC8gKGkgKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICkgLSBQb3Nlcy5CTElOS19SQVRJT19MT1c7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGVmdEJsaW5rID0gcmVtYXBSYW5nZU5vQ2FwKFxuICAgICAgICAgICAgdGhpcy5fYmxpbmtCYXNlLnBvcy54LFxuICAgICAgICAgICAgUG9zZXMuQkxJTktfUkFUSU9fTE9XICsgbGVmdFJhbmdlT2Zmc2V0LFxuICAgICAgICAgICAgUG9zZXMuQkxJTktfUkFUSU9fSElHSCArIGxlZnRSYW5nZU9mZnNldCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2xlZnRCbGlua0Fyci5wdXNoKHRoaXMuX2JsaW5rQmFzZS5wb3MueCk7XG5cbiAgICAgICAgbGV0IHJpZ2h0UmFuZ2VPZmZzZXQgPSAwO1xuICAgICAgICBpZiAodGhpcy5fcmlnaHRCbGlua0Fyci5sZW5ndGgoKSA+IDQpIHtcbiAgICAgICAgICAgIHJpZ2h0UmFuZ2VPZmZzZXQgPVxuICAgICAgICAgICAgICAgIHRoaXMuX3JpZ2h0QmxpbmtBcnIudmFsdWVzLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgKHAsIGMsIGkpID0+IHAgKyAoYyAtIHApIC8gKGkgKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICkgLSBQb3Nlcy5CTElOS19SQVRJT19MT1c7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmlnaHRCbGluayA9IHJlbWFwUmFuZ2VOb0NhcChcbiAgICAgICAgICAgIHRoaXMuX2JsaW5rQmFzZS5wb3MueSxcbiAgICAgICAgICAgIFBvc2VzLkJMSU5LX1JBVElPX0xPVyArIHJpZ2h0UmFuZ2VPZmZzZXQsXG4gICAgICAgICAgICBQb3Nlcy5CTElOS19SQVRJT19ISUdIICsgcmlnaHRSYW5nZU9mZnNldCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3JpZ2h0QmxpbmtBcnIucHVzaCh0aGlzLl9ibGlua0Jhc2UucG9zLnkpO1xuXG4gICAgICAgIGNvbnN0IGJsaW5rID0gdGhpcy5sUkxpbmsobGVmdEJsaW5rLCByaWdodEJsaW5rKTtcblxuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiYmxpbmtcIl0uc2V0KFxuICAgICAgICAgICAgbmV3IFF1YXRlcm5pb24obGVmdEJsaW5rLCByaWdodEJsaW5rLCBibGluaywgMClcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBtb3V0aFdpZHRoID0gdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2xlZnQucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX3JpZ2h0LnBvcylcbiAgICAgICAgICAgIC5sZW5ndGgoKTtcbiAgICAgICAgY29uc3QgbW91dGhSYW5nZTEgPSByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgICh0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX2ZpcnN0LnBvc1xuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMubW91dGhfYm90dG9tX2ZpcnN0LnBvcylcbiAgICAgICAgICAgICAgICAubGVuZ3RoKCkgKlxuICAgICAgICAgICAgICAgIFBvc2VzLk1PVVRIX1dJRFRIX0JBU0VMSU5FKSAvXG4gICAgICAgICAgICAgICAgbW91dGhXaWR0aCxcbiAgICAgICAgICAgIFBvc2VzLk1PVVRIX01QX1JBTkdFX0xPVyxcbiAgICAgICAgICAgIFBvc2VzLk1PVVRIX01QX1JBTkdFX0hJR0gsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBtb3V0aFJhbmdlMiA9IHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgKHRoaXMuX2tleVBvaW50cy5tb3V0aF90b3Bfc2Vjb25kLnBvc1xuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMubW91dGhfYm90dG9tX3NlY29uZC5wb3MpXG4gICAgICAgICAgICAgICAgLmxlbmd0aCgpICpcbiAgICAgICAgICAgICAgICBQb3Nlcy5NT1VUSF9XSURUSF9CQVNFTElORSkgL1xuICAgICAgICAgICAgICAgIG1vdXRoV2lkdGgsXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9MT1csXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9ISUdILFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbW91dGhSYW5nZTMgPSByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgICh0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX3RoaXJkLnBvc1xuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMubW91dGhfYm90dG9tX3RoaXJkLnBvcylcbiAgICAgICAgICAgICAgICAubGVuZ3RoKCkgKlxuICAgICAgICAgICAgICAgIFBvc2VzLk1PVVRIX1dJRFRIX0JBU0VMSU5FKSAvXG4gICAgICAgICAgICAgICAgbW91dGhXaWR0aCxcbiAgICAgICAgICAgIFBvc2VzLk1PVVRIX01QX1JBTkdFX0xPVyxcbiAgICAgICAgICAgIFBvc2VzLk1PVVRIX01QX1JBTkdFX0hJR0gsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wibW91dGhcIl0uc2V0KFxuICAgICAgICAgICAgbmV3IFF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgKG1vdXRoUmFuZ2UxICsgbW91dGhSYW5nZTIgKyBtb3V0aFJhbmdlMykgLyAzLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjUG9zZUJvbmVzKCkge1xuICAgICAgICAvLyBEbyBub3QgY2FsY3VsYXRlIHBvc2UgaWYgbm8gdmlzaWJsZSBmYWNlLiBJdCBjYW4gbGVhZCB0byB3aWVyZCBwb3Nlcy5cbiAgICAgICAgaWYgKCF0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrcykgcmV0dXJuO1xuICAgICAgICAvLyBVc2UgaGlwcyBhcyB0aGUgc3RhcnRpbmcgcG9pbnQuIFJvdGF0aW9uIG9mIGhpcHMgaXMgYWx3YXlzIG9uIFhaIHBsYW5lLlxuICAgICAgICAvLyBVcHBlciBjaGVzdCBpcyBub3QgdXNlZC5cbiAgICAgICAgLy8gVE9ETyBkZXJpdmUgbmVjayBhbmQgY2hlc3QgZnJvbSBzcGluZSBhbmQgaGVhZC5cblxuICAgICAgICBjb25zdCBsZWZ0SGlwID0gdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuTEVGVF9ISVBdLnBvcztcbiAgICAgICAgY29uc3QgcmlnaHRIaXAgPSB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5SSUdIVF9ISVBdLnBvcztcbiAgICAgICAgY29uc3QgbGVmdFNob3VsZGVyID1cbiAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLkxFRlRfU0hPVUxERVJdLnBvcztcbiAgICAgICAgY29uc3QgcmlnaHRTaG91bGRlciA9XG4gICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5SSUdIVF9TSE9VTERFUl0ucG9zO1xuXG4gICAgICAgIHRoaXMucG9zZU5vcm1hbHMubGVuZ3RoID0gMDtcblxuICAgICAgICAvLyBIaXBzXG4gICAgICAgIGNvbnN0IHdvcmxkWFpQbGFuZSA9IFBsYW5lLkZyb21Qb3NpdGlvbkFuZE5vcm1hbChcbiAgICAgICAgICAgIFZlY3RvcjMuWmVybygpLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaGlwTGluZSA9IGxlZnRIaXAuc3VidHJhY3QocmlnaHRIaXApO1xuICAgICAgICBjb25zdCBoaXBMaW5lUHJvaiA9IHByb2plY3RWZWN0b3JPblBsYW5lKHdvcmxkWFpQbGFuZSwgaGlwTGluZSk7XG4gICAgICAgIGNvbnN0IGhpcFJvdGF0aW9uQW5nbGUgPSBNYXRoLmF0YW4yKGhpcExpbmVQcm9qLnosIGhpcExpbmVQcm9qLngpO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaGlwc1wiXS5zZXQoXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcygwLCBoaXBSb3RhdGlvbkFuZ2xlLCAwKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENoZXN0L1Nob3VsZGVyXG4gICAgICAgIGNvbnN0IHNob3VsZGVyTm9ybVIgPSBQbGFuZS5Gcm9tUG9pbnRzKFxuICAgICAgICAgICAgcmlnaHRTaG91bGRlcixcbiAgICAgICAgICAgIGxlZnRTaG91bGRlcixcbiAgICAgICAgICAgIHJpZ2h0SGlwXG4gICAgICAgICkubm9ybWFsO1xuICAgICAgICBjb25zdCBzaG91bGRlck5vcm1MID0gUGxhbmUuRnJvbVBvaW50cyhcbiAgICAgICAgICAgIHJpZ2h0U2hvdWxkZXIsXG4gICAgICAgICAgICBsZWZ0U2hvdWxkZXIsXG4gICAgICAgICAgICBsZWZ0SGlwXG4gICAgICAgICkubm9ybWFsO1xuICAgICAgICBjb25zdCBzaG91bGRlck5vcm1hbCA9IHNob3VsZGVyTm9ybUwuYWRkKHNob3VsZGVyTm9ybVIpLm5vcm1hbGl6ZSgpO1xuXG4gICAgICAgIC8vIFNwaW5lXG4gICAgICAgIGlmIChzaG91bGRlck5vcm1hbC5sZW5ndGgoKSA+IDAuMSkge1xuICAgICAgICAgICAgY29uc3Qgc3BpbmVQYXJlbnRRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICBcInNwaW5lXCIsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBzcGluZUJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tcInNwaW5lXCJdLnJvdGF0ZUJhc2lzKFxuICAgICAgICAgICAgICAgIHNwaW5lUGFyZW50UXVhdGVybmlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NwaW5lQmFzaXNZID0gcmlnaHRTaG91bGRlclxuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChsZWZ0U2hvdWxkZXIpXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgbmV3U3BpbmVCYXNpcyA9IG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgc2hvdWxkZXJOb3JtYWwsXG4gICAgICAgICAgICAgICAgbmV3U3BpbmVCYXNpc1ksXG4gICAgICAgICAgICAgICAgVmVjdG9yMy5Dcm9zcyhzaG91bGRlck5vcm1hbCwgbmV3U3BpbmVCYXNpc1kpLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJzcGluZVwiXS5zZXQoXG4gICAgICAgICAgICAgICAgcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgICAgICBxdWF0ZXJuaW9uQmV0d2VlbkJhc2VzKFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BpbmVCYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwaW5lQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGluZVBhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGNXcmlzdEJvbmVzKCk7XG5cbiAgICAgICAgLy8gQXJtc1xuICAgICAgICBsZXQgdGhldGEgPSAwLFxuICAgICAgICAgICAgcGhpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIExSKSB7XG4gICAgICAgICAgICBjb25zdCBpc0xlZnQgPSBrID09PSBcImxlZnRcIjtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaGFsbFVwZGF0ZUFybShpc0xlZnQpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgdXBwZXJBcm1LZXkgPSBgJHtrfVVwcGVyQXJtYDtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZGVyTGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLU1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fU0hPVUxERVJgIGFzIGtleW9mIHR5cGVvZiBQT1NFX0xBTkRNQVJLU1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG4gICAgICAgICAgICBjb25zdCBlbGJvd0xhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgUE9TRV9MQU5ETUFSS1NbXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtrLnRvVXBwZXJDYXNlKCl9X0VMQk9XYCBhcyBrZXlvZiB0eXBlb2YgUE9TRV9MQU5ETUFSS1NcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIF0ucG9zO1xuICAgICAgICAgICAgY29uc3Qgd3Jpc3RMYW5kbWFyayA9XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9XUklTVGAgYXMga2V5b2YgdHlwZW9mIFBPU0VfTEFORE1BUktTXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcblxuICAgICAgICAgICAgY29uc3QgdXBwZXJBcm1EaXIgPSBlbGJvd0xhbmRtYXJrXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KHNob3VsZGVyTGFuZG1hcmspXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgdXBwZXJBcm1QYXJlbnRRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICB1cHBlckFybUtleSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtQmFzaXMgPSB0aGlzLl9ib25lUm90YXRpb25zW3VwcGVyQXJtS2V5XS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgICAgICB1cHBlckFybVBhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIFt0aGV0YSwgcGhpXSA9IGNhbGNTcGhlcmljYWxDb29yZCh1cHBlckFybURpciwgdXBwZXJBcm1CYXNpcyk7XG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW3VwcGVyQXJtS2V5XS5zZXQoXG4gICAgICAgICAgICAgICAgcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgICAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgICAgICB1cHBlckFybUJhc2lzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhldGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaGksXG4gICAgICAgICAgICAgICAgICAgICAgICB1cHBlckFybVBhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIFJvdGF0ZSBsb3dlciBhcm1zIGFyb3VuZCBYIGF4aXMgdG9nZXRoZXIgd2l0aCBoYW5kcy5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBjb21iaW5hdGlvbiBvZiBzcGhlcmljYWwgY29vcmRpbmF0ZXMgcm90YXRpb24gYW5kIHJvdGF0aW9uIGJldHdlZW4gYmFzZXMuXG4gICAgICAgICAgICBjb25zdCBoYW5kTm9ybWFsID0gaXNMZWZ0XG4gICAgICAgICAgICAgICAgPyB0aGlzLmxlZnRIYW5kTm9ybWFsXG4gICAgICAgICAgICAgICAgOiB0aGlzLnJpZ2h0SGFuZE5vcm1hbDtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyQXJtS2V5ID0gYCR7a31Mb3dlckFybWA7XG4gICAgICAgICAgICBjb25zdCBsb3dlckFybURpciA9IHdyaXN0TGFuZG1hcmtcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QoZWxib3dMYW5kbWFyaylcbiAgICAgICAgICAgICAgICAubm9ybWFsaXplKCk7XG4gICAgICAgICAgICBjb25zdCBsb3dlckFybVByZXZRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICBsb3dlckFybUtleSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyQXJtQmFzaXMgPSB0aGlzLl9ib25lUm90YXRpb25zW2xvd2VyQXJtS2V5XS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgICAgICBsb3dlckFybVByZXZRdWF0ZXJuaW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgW3RoZXRhLCBwaGldID0gY2FsY1NwaGVyaWNhbENvb3JkKGxvd2VyQXJtRGlyLCBsb3dlckFybUJhc2lzKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZE5vcm1hbHNLZXkgPSBgJHtrfUhhbmROb3JtYWxzYDtcbiAgICAgICAgICAgIGNvbnN0IGhhbmROb3JtYWxzID0gdGhpc1tcbiAgICAgICAgICAgICAgICBoYW5kTm9ybWFsc0tleSBhcyBQb3Nlc0tleVxuICAgICAgICAgICAgXSBhcyBOb3JtYWxpemVkTGFuZG1hcmtMaXN0O1xuICAgICAgICAgICAgaGFuZE5vcm1hbHMubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgY29uc3QgZmlyc3RRdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgIHNwaGVyaWNhbFRvUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJBcm1CYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgdGhldGEsXG4gICAgICAgICAgICAgICAgICAgIHBoaSxcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJBcm1QcmV2UXVhdGVybmlvblxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsUXVhdGVybmlvbiA9IHRoaXMuYXBwbHlYUm90YXRpb25XaXRoQ2hpbGQoXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1LZXksXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1QcmV2UXVhdGVybmlvbixcbiAgICAgICAgICAgICAgICBmaXJzdFF1YXRlcm5pb24sXG4gICAgICAgICAgICAgICAgaGFuZE5vcm1hbCxcbiAgICAgICAgICAgICAgICBsb3dlckFybUJhc2lzXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW2xvd2VyQXJtS2V5XS5zZXQoZmluYWxRdWF0ZXJuaW9uKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgcm90YXRpb25zIG9uIHdyaXN0c1xuICAgICAgICB0aGlzLmNhbGNXcmlzdEJvbmVzKGZhbHNlKTtcblxuICAgICAgICAvLyBMZWdzIGFuZCBmZWV0XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBMUikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2hhbGxVcGRhdGVMZWdzKGlzTGVmdCkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjb25zdCB0aGlzTGFuZG1hcmtzID0gaXNMZWZ0XG4gICAgICAgICAgICAgICAgPyBQT1NFX0xBTkRNQVJLU19MRUZUXG4gICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVDtcbiAgICAgICAgICAgIGNvbnN0IHVwcGVyTGVnS2V5ID0gYCR7a31VcHBlckxlZ2A7XG4gICAgICAgICAgICBjb25zdCBsb3dlckxlZ0tleSA9IGAke2t9TG93ZXJMZWdgO1xuICAgICAgICAgICAgY29uc3QgaGlwTGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICB0aGlzTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9ISVBgIGFzIGtleW9mIHR5cGVvZiB0aGlzTGFuZG1hcmtzXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcbiAgICAgICAgICAgIGNvbnN0IGtuZWVMYW5kbWFyayA9XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIHRoaXNMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtrLnRvVXBwZXJDYXNlKCl9X0tORUVgIGFzIGtleW9mIHR5cGVvZiB0aGlzTGFuZG1hcmtzXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcbiAgICAgICAgICAgIGNvbnN0IGFua2xlTGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICB0aGlzTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9BTktMRWAgYXMga2V5b2YgdHlwZW9mIHRoaXNMYW5kbWFya3NcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIF0ucG9zO1xuXG4gICAgICAgICAgICBjb25zdCB1cHBlckxlZ0RpciA9IGtuZWVMYW5kbWFyay5zdWJ0cmFjdChoaXBMYW5kbWFyaykubm9ybWFsaXplKCk7XG4gICAgICAgICAgICBjb25zdCB1cHBlckxlZ1BhcmVudFF1YXRlcm5pb24gPSB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKFxuICAgICAgICAgICAgICAgIHVwcGVyTGVnS2V5LFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgdXBwZXJMZWdCYXNpcyA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbdXBwZXJMZWdLZXldLnJvdGF0ZUJhc2lzKFxuICAgICAgICAgICAgICAgIHVwcGVyTGVnUGFyZW50UXVhdGVybmlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFt0aGV0YSwgcGhpXSA9IGNhbGNTcGhlcmljYWxDb29yZCh1cHBlckxlZ0RpciwgdXBwZXJMZWdCYXNpcyk7XG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW3VwcGVyTGVnS2V5XS5zZXQoXG4gICAgICAgICAgICAgICAgcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgICAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgICAgICB1cHBlckxlZ0Jhc2lzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhldGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaGksXG4gICAgICAgICAgICAgICAgICAgICAgICB1cHBlckxlZ1BhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxvd2VyTGVnRGlyID0gYW5rbGVMYW5kbWFya1xuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChrbmVlTGFuZG1hcmspXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJMZWdQcmV2UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgbG93ZXJMZWdLZXksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBsb3dlckxlZ0Jhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tsb3dlckxlZ0tleV0ucm90YXRlQmFzaXMoXG4gICAgICAgICAgICAgICAgbG93ZXJMZWdQcmV2UXVhdGVybmlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFt0aGV0YSwgcGhpXSA9IGNhbGNTcGhlcmljYWxDb29yZChsb3dlckxlZ0RpciwgbG93ZXJMZWdCYXNpcyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdFF1YXRlcm5pb24gPSByZXZlcnNlUm90YXRpb24oXG4gICAgICAgICAgICAgICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBsb3dlckxlZ0Jhc2lzLFxuICAgICAgICAgICAgICAgICAgICB0aGV0YSxcbiAgICAgICAgICAgICAgICAgICAgcGhpLFxuICAgICAgICAgICAgICAgICAgICBsb3dlckxlZ1ByZXZRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBBWElTLnl6XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tsb3dlckxlZ0tleV0uc2V0KGZpcnN0UXVhdGVybmlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGNGZWV0Qm9uZXMoZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoaXNLZXk6IGtleSBpbiBfYm9uZVJvdGF0aW9uc1xuICAgICAqIHByZXZRdWF0ZXJuaW9uOiBQYXJlbnQgY3VtdWxhdGVkIHJvdGF0aW9uIHF1YXRlcm5pb25cbiAgICAgKiBmaXJzdFF1YXRlcm5pb246IFJvdGF0aW9uIHF1YXRlcm5pb24gY2FsY3VsYXRlZCB3aXRob3V0IGFwcGx5aW5nIFggcm90YXRpb25cbiAgICAgKiBub3JtYWw6IEEgbm9ybWFsIHBvaW50aW5nIHRvIGxvY2FsIC15XG4gICAgICogdGhpc0Jhc2lzOiBiYXNpcyBvbiB0aGlzIG5vZGUgYWZ0ZXIgcHJldlF1YXRlcm5pb24gaXMgYXBwbGllZFxuICAgICAqL1xuICAgIHByaXZhdGUgYXBwbHlYUm90YXRpb25XaXRoQ2hpbGQoXG4gICAgICAgIHRoaXNLZXk6IHN0cmluZyxcbiAgICAgICAgcHJldlF1YXRlcm5pb246IFF1YXRlcm5pb24sXG4gICAgICAgIGZpcnN0UXVhdGVybmlvbjogUXVhdGVybmlvbixcbiAgICAgICAgbm9ybWFsOiBWZWN0b3IzLFxuICAgICAgICB0aGlzQmFzaXM6IEJhc2lzXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IHRoaXNSb3RhdGVkQmFzaXMgPSB0aGlzLl9ib25lUm90YXRpb25zW3RoaXNLZXldLnJvdGF0ZUJhc2lzKFxuICAgICAgICAgICAgcHJldlF1YXRlcm5pb24ubXVsdGlwbHkocmV2ZXJzZVJvdGF0aW9uKGZpcnN0UXVhdGVybmlvbiwgQVhJUy55eikpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgdGhpc1laUGxhbmUgPSBQbGFuZS5Gcm9tUG9zaXRpb25BbmROb3JtYWwoXG4gICAgICAgICAgICBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueC5jbG9uZSgpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHByb2plY3RlZE5vcm1hbCA9IFZlY3RvcjMuWmVybygpO1xuICAgICAgICBwcm9qZWN0VmVjdG9yT25QbGFuZSh0aGlzWVpQbGFuZSwgbm9ybWFsKS5yb3RhdGVCeVF1YXRlcm5pb25Ub1JlZihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSW52ZXJzZShcbiAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLlJvdGF0aW9uUXVhdGVybmlvbkZyb21BeGlzKFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnguY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy55LmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMuei5jbG9uZSgpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHByb2plY3RlZE5vcm1hbFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwcm9qZWN0ZWRQcmV2WiA9IFZlY3RvcjMuWmVybygpO1xuICAgICAgICBwcm9qZWN0VmVjdG9yT25QbGFuZShcbiAgICAgICAgICAgIHRoaXNZWlBsYW5lLFxuICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy56Lm5lZ2F0ZSgpXG4gICAgICAgICkucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYoXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLkludmVyc2UoXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy54LmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnouY2xvbmUoKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBwcm9qZWN0ZWRQcmV2WlxuICAgICAgICApO1xuICAgICAgICBwcm9qZWN0ZWRQcmV2Wi5ub3JtYWxpemUoKTtcbiAgICAgICAgbGV0IHhQcmV2ID0gTWF0aC5hdGFuMihwcm9qZWN0ZWRQcmV2Wi55LCAtcHJvamVjdGVkUHJldloueik7XG4gICAgICAgIGxldCB4QW5nbGUgPSBNYXRoLmF0YW4yKHByb2plY3RlZE5vcm1hbC55LCAtcHJvamVjdGVkTm9ybWFsLnopO1xuICAgICAgICBpZiAoeEFuZ2xlID4gMCkgeEFuZ2xlIC09IE1hdGguUEkgKiAyO1xuICAgICAgICBpZiAoeEFuZ2xlIDwgLU1hdGguUEkgKiAxLjI1KSB4QW5nbGUgPSB4UHJldjtcbiAgICAgICAgLy8gaWYgKGlzTGVnKSB7XG4gICAgICAgIC8vICAgICBpZiAoTWF0aC5hYnMoeEFuZ2xlKSA+IE1hdGguUEkgKiAwLjI3NzggJiYgTWF0aC5hYnMoeEFuZ2xlKSA8IE1hdGguUEkgLyAyKSB7XG4gICAgICAgIC8vICAgICAgICAgeEFuZ2xlIC09IE1hdGguUEkgKiAwLjI3Nzg7XG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgIHhBbmdsZSA9IHhQcmV2O1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgdGhpc1hSb3RhdGVkQmFzaXMgPSB0aGlzUm90YXRlZEJhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uUm90YXRpb25BeGlzKFxuICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICh4QW5nbGUgLSB4UHJldikgKiAwLjVcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgLy8gVGhlIHF1YXRlcm5pb24gbmVlZHMgdG8gYmUgY2FsY3VsYXRlZCBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbVxuICAgICAgICBjb25zdCBzZWNvbmRRdWF0ZXJuaW9uID0gcXVhdGVybmlvbkJldHdlZW5CYXNlcyhcbiAgICAgICAgICAgIHRoaXNCYXNpcyxcbiAgICAgICAgICAgIHRoaXNYUm90YXRlZEJhc2lzLFxuICAgICAgICAgICAgcHJldlF1YXRlcm5pb25cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBmaW5hbFF1YXRlcm5pb24gPSByZXZlcnNlUm90YXRpb24oc2Vjb25kUXVhdGVybmlvbiwgQVhJUy55eik7XG4gICAgICAgIHJldHVybiBmaW5hbFF1YXRlcm5pb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjV3Jpc3RCb25lcyhmaXJzdFBhc3MgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGhhbmRzID0ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5sZWZ0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgICAgIHJpZ2h0OiB0aGlzLnJpZ2h0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhoYW5kcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgY29uc3Qgd3Jpc3RWaXNpbGliaXR5ID1cbiAgICAgICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICA/IFBPU0VfTEFORE1BUktTLkxFRlRfV1JJU1RcbiAgICAgICAgICAgICAgICAgICAgICAgIDogUE9TRV9MQU5ETUFSS1MuUklHSFRfV1JJU1RcbiAgICAgICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgICAgIGlmICh3cmlzdFZpc2lsaWJpdHkgPD0gVklTSUJJTElUWV9USFJFU0hPTEQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjb25zdCB2ZXJ0aWNlczogRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjNbXSA9IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuV1JJU1RdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLlBJTktZX01DUF0sXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuSU5ERVhfRklOR0VSX01DUF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuV1JJU1RdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLlJJTkdfRklOR0VSX01DUF0sXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuSU5ERVhfRklOR0VSX01DUF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuV1JJU1RdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLlBJTktZX01DUF0sXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuTUlERExFX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAvLyBSb290IG5vcm1hbFxuICAgICAgICAgICAgY29uc3QgaGFuZE5vcm1hbCA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gdGhpcy5sZWZ0SGFuZE5vcm1hbFxuICAgICAgICAgICAgICAgIDogdGhpcy5yaWdodEhhbmROb3JtYWw7XG4gICAgICAgICAgICBjb25zdCByb290Tm9ybWFsID0gdmVydGljZXNcbiAgICAgICAgICAgICAgICAucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9ub3JtYWwgPSBQb3Nlcy5ub3JtYWxGcm9tVmVydGljZXMoY3VyciwgaXNMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFuZE5vcm1hbHMucHVzaCh2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayhfbm9ybWFsKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2LmFkZChfbm9ybWFsKTtcbiAgICAgICAgICAgICAgICB9LCBWZWN0b3IzLlplcm8oKSlcbiAgICAgICAgICAgICAgICAubm9ybWFsaXplKCk7XG4gICAgICAgICAgICBoYW5kTm9ybWFsLmNvcHlGcm9tKHJvb3ROb3JtYWwpO1xuICAgICAgICAgICAgLy8gaGFuZE5vcm1hbHMucHVzaCh2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayhyb290Tm9ybWFsKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRoaXNXcmlzdFJvdGF0aW9uID1cbiAgICAgICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1xuICAgICAgICAgICAgICAgICAgICBoYW5kTGFuZE1hcmtUb0JvbmVOYW1lKEhBTkRfTEFORE1BUktTLldSSVNULCBpc0xlZnQpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2lzMTogQmFzaXMgPSB0aGlzV3Jpc3RSb3RhdGlvbi5iYXNlQmFzaXM7XG5cbiAgICAgICAgICAgIC8vIFByb2plY3QgcGFsbSBsYW5kbWFya3MgdG8gYXZlcmFnZSBwbGFuZVxuICAgICAgICAgICAgY29uc3QgcHJvamVjdGVkTGFuZG1hcmtzID0gY2FsY0F2Z1BsYW5lKFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5XUklTVF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5NSURETEVfRklOR0VSX01DUF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLlJJTkdfRklOR0VSX01DUF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLlBJTktZX01DUF0ucG9zLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcm9vdE5vcm1hbFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2lzMiA9IGdldEJhc2lzKFtcbiAgICAgICAgICAgICAgICBwcm9qZWN0ZWRMYW5kbWFya3NbMF0sXG4gICAgICAgICAgICAgICAgcHJvamVjdGVkTGFuZG1hcmtzWzFdLFxuICAgICAgICAgICAgICAgIHByb2plY3RlZExhbmRtYXJrc1s0XSxcbiAgICAgICAgICAgIF0pLnJvdGF0ZUJ5UXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKFxuICAgICAgICAgICAgICAgICAgICBIQU5EX0xBTkRNQVJLUy5XUklTVCxcbiAgICAgICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgKS5jb25qdWdhdGUoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHdyaXN0Um90YXRpb25RdWF0ZXJuaW9uUmF3ID0gcXVhdGVybmlvbkJldHdlZW5CYXNlcyhcbiAgICAgICAgICAgICAgICBiYXNpczEsXG4gICAgICAgICAgICAgICAgYmFzaXMyXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCB3cmlzdFJvdGF0aW9uUXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICB3cmlzdFJvdGF0aW9uUXVhdGVybmlvblJhdyxcbiAgICAgICAgICAgICAgICBBWElTLnl6XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFmaXJzdFBhc3MpIHRoaXNXcmlzdFJvdGF0aW9uLnNldCh3cmlzdFJvdGF0aW9uUXVhdGVybmlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNIYW5kQm9uZXMoKSB7XG4gICAgICAgIC8vIFJpZ2h0IGhhbmQgc2hhbGwgaGF2ZSBsb2NhbCB4IHJldmVyc2VkP1xuICAgICAgICBjb25zdCBoYW5kcyA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubGVmdEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICByaWdodDogdGhpcy5yaWdodEhhbmRMYW5kbWFya3MsXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoaGFuZHMpKSB7XG4gICAgICAgICAgICBjb25zdCBpc0xlZnQgPSBrID09PSBcImxlZnRcIjtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBIQU5EX0xBTkRNQVJLX0xFTkdUSDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgJSA0ID09PSAwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNIYW5kUm90YXRpb24gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW2hhbmRMYW5kTWFya1RvQm9uZU5hbWUoaSwgaXNMZWZ0KV07XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc0xhbmRtYXJrID0gdltpXS5wb3MuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0TGFuZG1hcmsgPSB2W2kgKyAxXS5wb3MuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBsZXQgdGhpc0RpciA9IG5leHRMYW5kbWFyay5zdWJ0cmFjdCh0aGlzTGFuZG1hcmspLm5vcm1hbGl6ZSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldlF1YXRlcm5pb24gPSB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKGksIGlzTGVmdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc0Jhc2lzID0gdGhpc0hhbmRSb3RhdGlvbi5yb3RhdGVCYXNpcyhwcmV2UXVhdGVybmlvbik7XG5cbiAgICAgICAgICAgICAgICAvLyBQcm9qZWN0IGxhbmRtYXJrIHRvIFhaIHBsYW5lIGZvciBzZWNvbmQgYW5kIHRoaXJkIHNlZ21lbnRzXG4gICAgICAgICAgICAgICAgaWYgKGkgJSA0ID09PSAyIHx8IGkgJSA0ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2pQbGFuZSA9IFBsYW5lLkZyb21Qb3NpdGlvbkFuZE5vcm1hbChcbiAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvcjMuWmVybygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0Jhc2lzLnkuY2xvbmUoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzRGlyID0gcHJvamVjdFZlY3Rvck9uUGxhbmUocHJvalBsYW5lLCB0aGlzRGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IFt0aGV0YSwgcGhpXSA9IGNhbGNTcGhlcmljYWxDb29yZCh0aGlzRGlyLCB0aGlzQmFzaXMpO1xuXG4gICAgICAgICAgICAgICAgLy8gTmVlZCB0byB1c2Ugb3JpZ2luYWwgQmFzaXMsIGJlY2F1c2UgdGhlIHF1YXRlcm5pb24gZnJvbVxuICAgICAgICAgICAgICAgIC8vIFJvdGF0aW9uQXhpcyBpbmhlcmVudGx5IHVzZXMgbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgICAgICAgICAgICAgbGV0IHRoaXNSb3RhdGlvblF1YXRlcm5pb247XG4gICAgICAgICAgICAgICAgY29uc3QgbHJDb2VmZiA9IGlzTGVmdCA/IC0xIDogMTtcbiAgICAgICAgICAgICAgICAvLyBUaHVtYiByb3RhdGlvbnMgYXJlIHkgbWFpbi4gT3RoZXJzIGFyZSB6IG1haW4uXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlQXhpcyA9XG4gICAgICAgICAgICAgICAgICAgIGkgJSA0ID09PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGkgPCA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBBWElTLm5vbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IEFYSVMueFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpIDwgNFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBBWElTLnh6XG4gICAgICAgICAgICAgICAgICAgICAgICA6IEFYSVMueHk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlyc3RDYXBBeGlzID0gaSA8IDQgPyBBWElTLnogOiBBWElTLnk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2Vjb25kQ2FwQXhpcyA9IGkgPCA0ID8gQVhJUy55IDogQVhJUy56O1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlY29uZENhcCA9IGkgPCAyID8gMTUgOiAxMTA7XG4gICAgICAgICAgICAgICAgdGhpc1JvdGF0aW9uUXVhdGVybmlvbiA9IHJlbW92ZVJvdGF0aW9uQXhpc1dpdGhDYXAoXG4gICAgICAgICAgICAgICAgICAgIHNwaGVyaWNhbFRvUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNCYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldlF1YXRlcm5pb25cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQXhpcyxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RDYXBBeGlzLFxuICAgICAgICAgICAgICAgICAgICAtMTUsXG4gICAgICAgICAgICAgICAgICAgIDE1LFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRDYXBBeGlzLFxuICAgICAgICAgICAgICAgICAgICBsckNvZWZmICogLTE1LFxuICAgICAgICAgICAgICAgICAgICBsckNvZWZmICogc2Vjb25kQ2FwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzUm90YXRpb25RdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRpb25RdWF0ZXJuaW9uLFxuICAgICAgICAgICAgICAgICAgICBBWElTLnl6XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzSGFuZFJvdGF0aW9uLnNldCh0aGlzUm90YXRpb25RdWF0ZXJuaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY0ZlZXRCb25lcyhmaXJzdFBhc3MgPSB0cnVlKSB7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBMUikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2hhbGxVcGRhdGVMZWdzKGlzTGVmdCkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjb25zdCBsYW5kbWFya0Jhc2lzID0gaXNMZWZ0XG4gICAgICAgICAgICAgICAgPyBnZXRCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0hFRUxdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5wb3MsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9GT09UX0lOREVYXG4gICAgICAgICAgICAgICAgICAgICAgXS5wb3MsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0FOS0xFXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zLFxuICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICA6IGdldEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9IRUVMXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9GT09UX0lOREVYXG4gICAgICAgICAgICAgICAgICAgICAgXS5wb3MsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1NfUklHSFQuUklHSFRfQU5LTEVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5wb3MsXG4gICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgY29uc3QgZm9vdEJvbmVLZXkgPSBgJHtrfUZvb3RgO1xuICAgICAgICAgICAgY29uc3QgdGhpc0Jhc2lzID0gbGFuZG1hcmtCYXNpc1xuICAgICAgICAgICAgICAgIC5uZWdhdGVBeGVzKEFYSVMueXopXG4gICAgICAgICAgICAgICAgLnRyYW5zcG9zZShbMSwgMiwgMF0pO1xuICAgICAgICAgICAgdGhpc0Jhc2lzLnZlcmlmeUJhc2lzKCk7XG5cbiAgICAgICAgICAgIC8vIFJvb3Qgbm9ybWFsXG4gICAgICAgICAgICBjb25zdCBmb290Tm9ybWFsID0gaXNMZWZ0XG4gICAgICAgICAgICAgICAgPyB0aGlzLmxlZnRGb290Tm9ybWFsXG4gICAgICAgICAgICAgICAgOiB0aGlzLnJpZ2h0Rm9vdE5vcm1hbDtcbiAgICAgICAgICAgIGZvb3ROb3JtYWwuY29weUZyb20odGhpc0Jhc2lzLnoubmVnYXRlKCkpO1xuXG4gICAgICAgICAgICBjb25zdCB0aGlzRm9vdFJvdGF0aW9uID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tmb290Qm9uZUtleV07XG4gICAgICAgICAgICBjb25zdCBiYXNpczE6IEJhc2lzID0gdGhpc0Zvb3RSb3RhdGlvbi5iYXNlQmFzaXM7XG4gICAgICAgICAgICBjb25zdCBiYXNpczIgPSB0aGlzQmFzaXMucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oZm9vdEJvbmVLZXksIGlzTGVmdCkuY29uanVnYXRlKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBmb290Um90YXRpb25RdWF0ZXJuaW9uUmF3ID0gcXVhdGVybmlvbkJldHdlZW5CYXNlcyhcbiAgICAgICAgICAgICAgICBiYXNpczEsXG4gICAgICAgICAgICAgICAgYmFzaXMyXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBmb290Um90YXRpb25RdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgIGZvb3RSb3RhdGlvblF1YXRlcm5pb25SYXcsXG4gICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghZmlyc3RQYXNzKSB0aGlzRm9vdFJvdGF0aW9uLnNldChmb290Um90YXRpb25RdWF0ZXJuaW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJlUHJvY2Vzc1Jlc3VsdHMoKSB7XG4gICAgICAgIC8vIFByZXByb2Nlc3NpbmcgcmVzdWx0c1xuICAgICAgICAvLyBDcmVhdGUgcG9zZSBsYW5kbWFyayBsaXN0XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29uc3QgaW5wdXRXb3JsZFBvc2VMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgLy8qIFRPRE86IFBhdGNoZWQuXG4gICAgICAgICAgICAvLyogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgwODMzODkvaWdub3JlLXR5cGVzY3JpcHQtZXJyb3JzLXByb3BlcnR5LWRvZXMtbm90LWV4aXN0LW9uLXZhbHVlLW9mLXR5cGVcbiAgICAgICAgICAgIC8vIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5lYTsgLy8gU2VlbXMgdG8gYmUgdGhlIG5ldyBwb3NlX3dvcmxkX2xhbmRtYXJrXG4gICAgICAgICAgICAodGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHMgYXMgYW55KT8uZWE7IC8vIFNlZW1zIHRvIGJlIHRoZSBuZXcgcG9zZV93b3JsZF9sYW5kbWFya1xuICAgICAgICBjb25zdCBpbnB1dFBvc2VMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3M7IC8vIFNlZW1zIHRvIGJlIHRoZSBuZXcgcG9zZV93b3JsZF9sYW5kbWFya1xuICAgICAgICBpZiAoaW5wdXRXb3JsZFBvc2VMYW5kbWFya3MgJiYgaW5wdXRQb3NlTGFuZG1hcmtzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRXb3JsZFBvc2VMYW5kbWFya3MubGVuZ3RoICE9PSBQT1NFX0xBTkRNQVJLX0xFTkdUSClcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgIGBQb3NlIExhbmRtYXJrIGxpc3QgaGFzIGEgbGVuZ3RoIGxlc3MgdGhhbiAke1BPU0VfTEFORE1BUktfTEVOR1RIfSFgXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dFBvc2VMYW5kbWFya3MgPSB0aGlzLnByZVByb2Nlc3NMYW5kbWFya3MoXG4gICAgICAgICAgICAgICAgaW5wdXRXb3JsZFBvc2VMYW5kbWFya3MsXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnByZVByb2Nlc3NMYW5kbWFya3MoaW5wdXRQb3NlTGFuZG1hcmtzLCB0aGlzLnBvc2VMYW5kbWFya3MpO1xuXG4gICAgICAgICAgICAvLyBQb3NpdGlvbmFsIG9mZnNldFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChpbnB1dFdvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX0hJUF0udmlzaWJpbGl0eSB8fFxuICAgICAgICAgICAgICAgICAgICAwKSA+IFZJU0lCSUxJVFlfVEhSRVNIT0xEICYmXG4gICAgICAgICAgICAgICAgKGlucHV0V29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLlJJR0hUX0hJUF0udmlzaWJpbGl0eSB8fFxuICAgICAgICAgICAgICAgICAgICAwKSA+IFZJU0lCSUxJVFlfVEhSRVNIT0xEXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaWRIaXBQb3MgPSB2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayhcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLkxFRlRfSElQXS5wb3NcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQodGhpcy5wb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLlJJR0hUX0hJUF0ucG9zKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNjYWxlSW5QbGFjZSgwLjUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBtaWRIaXBQb3MueiA9IDA7IC8vIE5vIGRlcHRoIGluZm9cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubWlkSGlwSW5pdE9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pZEhpcEluaXRPZmZzZXQgPSBtaWRIaXBQb3M7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5taWRIaXBJbml0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5taWRIaXBPZmZzZXQudXBkYXRlUG9zaXRpb24oXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgICAgICAgICAgICAgbWlkSGlwUG9zLnggLSB0aGlzLm1pZEhpcEluaXRPZmZzZXQueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pZEhpcFBvcy55IC0gdGhpcy5taWRIaXBJbml0T2Zmc2V0LnksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaWRIaXBQb3MueiAtIHRoaXMubWlkSGlwSW5pdE9mZnNldC56XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IGRlbHRhX3ggaW5zdGVhZCBvZiB4XG4gICAgICAgICAgICAgICAgdGhpcy5taWRIaXBQb3MgPSB2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayhcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taWRIaXBPZmZzZXQucG9zXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlucHV0RmFjZUxhbmRtYXJrcyA9IHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5mYWNlTGFuZG1hcmtzOyAvLyBTZWVtcyB0byBiZSB0aGUgbmV3IHBvc2Vfd29ybGRfbGFuZG1hcmtcbiAgICAgICAgaWYgKGlucHV0RmFjZUxhbmRtYXJrcykge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEZhY2VMYW5kbWFya3MgPSB0aGlzLnByZVByb2Nlc3NMYW5kbWFya3MoXG4gICAgICAgICAgICAgICAgaW5wdXRGYWNlTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IHVwZGF0ZSB3cmlzdCBvZmZzZXQgb25seSB3aGVuIGRlYnVnZ2luZ1xuICAgICAgICBjb25zdCBpbnB1dExlZnRIYW5kTGFuZG1hcmtzID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5sZWZ0SGFuZExhbmRtYXJrcztcbiAgICAgICAgY29uc3QgaW5wdXRSaWdodEhhbmRMYW5kbWFya3MgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnJpZ2h0SGFuZExhbmRtYXJrcztcbiAgICAgICAgaWYgKGlucHV0TGVmdEhhbmRMYW5kbWFya3MpIHtcbiAgICAgICAgICAgIHRoaXMubGVmdFdyaXN0T2Zmc2V0LnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLkxFRlRfV1JJU1RdLnBvcy5zdWJ0cmFjdChcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZExhbmRtYXJrVG9WZWN0b3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dExlZnRIYW5kTGFuZG1hcmtzW0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFBvc2VzLkhBTkRfUE9TSVRJT05fU0NBTElORyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmlucHV0TGVmdEhhbmRMYW5kbWFya3MgPSB0aGlzLnByZVByb2Nlc3NMYW5kbWFya3MoXG4gICAgICAgICAgICAgICAgaW5wdXRMZWZ0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMubGVmdFdyaXN0T2Zmc2V0LnBvcyxcbiAgICAgICAgICAgICAgICBQb3Nlcy5IQU5EX1BPU0lUSU9OX1NDQUxJTkdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzKSB7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0V3Jpc3RPZmZzZXQudXBkYXRlUG9zaXRpb24oXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTLlJJR0hUX1dSSVNUXG4gICAgICAgICAgICAgICAgXS5wb3Muc3VidHJhY3QoXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRSaWdodEhhbmRMYW5kbWFya3NbSEFORF9MQU5ETUFSS1MuV1JJU1RdLFxuICAgICAgICAgICAgICAgICAgICAgICAgUG9zZXMuSEFORF9QT1NJVElPTl9TQ0FMSU5HLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRSaWdodEhhbmRMYW5kbWFya3MgPSB0aGlzLnByZVByb2Nlc3NMYW5kbWFya3MoXG4gICAgICAgICAgICAgICAgaW5wdXRSaWdodEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodFdyaXN0T2Zmc2V0LnBvcyxcbiAgICAgICAgICAgICAgICBQb3Nlcy5IQU5EX1BPU0lUSU9OX1NDQUxJTkdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHByZVByb2Nlc3NMYW5kbWFya3MoXG4gICAgICAgIHJlc3VsdHNMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya1tdLFxuICAgICAgICBmaWx0ZXJlZExhbmRtYXJrczogRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QsXG4gICAgICAgIG9mZnNldCA9IFZlY3RvcjMuWmVybygpLFxuICAgICAgICBzY2FsaW5nID0gMVxuICAgICkge1xuICAgICAgICAvLyBSZXZlcnNlIFktYXhpcy4gSW5wdXQgcmVzdWx0cyB1c2UgY2FudmFzIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgICAgICByZXN1bHRzTGFuZG1hcmtzLm1hcCgodikgPT4ge1xuICAgICAgICAgICAgdi54ID0gdi54ICogc2NhbGluZyArIG9mZnNldC54O1xuICAgICAgICAgICAgdi55ID0gLXYueSAqIHNjYWxpbmcgKyBvZmZzZXQueTtcbiAgICAgICAgICAgIHYueiA9IHYueiAqIHNjYWxpbmcgKyBvZmZzZXQuejtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIE5vaXNlIGZpbHRlcmluZ1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHNMYW5kbWFya3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGZpbHRlcmVkTGFuZG1hcmtzW2ldLnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yKHJlc3VsdHNMYW5kbWFya3NbaV0pLFxuICAgICAgICAgICAgICAgIHJlc3VsdHNMYW5kbWFya3NbaV0udmlzaWJpbGl0eVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0c0xhbmRtYXJrcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvQ2xvbmVhYmxlTGFuZG1hcmtzKFxuICAgICAgICBsYW5kbWFya3M6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0LFxuICAgICAgICBjbG9uZWFibGVMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3RcbiAgICApIHtcbiAgICAgICAgY2xvbmVhYmxlTGFuZG1hcmtzLmZvckVhY2goKHYsIGlkeCkgPT4ge1xuICAgICAgICAgICAgdi54ID0gbGFuZG1hcmtzW2lkeF0ucG9zLng7XG4gICAgICAgICAgICB2LnkgPSBsYW5kbWFya3NbaWR4XS5wb3MueTtcbiAgICAgICAgICAgIHYueiA9IGxhbmRtYXJrc1tpZHhdLnBvcy56O1xuICAgICAgICAgICAgdi52aXNpYmlsaXR5ID0gbGFuZG1hcmtzW2lkeF0udmlzaWJpbGl0eTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaWx0ZXJGYWNlTGFuZG1hcmtzKCkge1xuICAgICAgICAvLyBVbnBhY2sgZmFjZSBtZXNoIGxhbmRtYXJrc1xuICAgICAgICB0aGlzLl9mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0Lmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2ZhY2VNZXNoTGFuZG1hcmtMaXN0Lmxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgUG9zZXMuRkFDRV9NRVNIX0NPTk5FQ1RJT05TLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgICAgICAgICAgUG9zZXMuRkFDRV9NRVNIX0NPTk5FQ1RJT05TW2ldLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgICAgICAgICBpZHguYWRkKHZbMF0pO1xuICAgICAgICAgICAgICAgIGlkeC5hZGQodlsxXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGlkeEFyciA9IEFycmF5LmZyb20oaWR4KTtcbiAgICAgICAgICAgIHRoaXMuX2ZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3QucHVzaChpZHhBcnIpO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpZHhBcnIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuZmFjZUxhbmRtYXJrc1tpZHhBcnJbal1dLnBvcy54LFxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLmZhY2VMYW5kbWFya3NbaWR4QXJyW2pdXS5wb3MueSxcbiAgICAgICAgICAgICAgICAgICAgejogdGhpcy5mYWNlTGFuZG1hcmtzW2lkeEFycltqXV0ucG9zLngsXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IHRoaXMuZmFjZUxhbmRtYXJrc1tpZHhBcnJbal1dLnZpc2liaWxpdHksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9mYWNlTWVzaExhbmRtYXJrTGlzdC5wdXNoKGFycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxSTGlua1dlaWdodHMoKSB7XG4gICAgICAgIGNvbnN0IGZhY2VDYW1lcmFBbmdsZSA9IGRlZ3JlZUJldHdlZW5WZWN0b3JzKFxuICAgICAgICAgICAgbm9ybWFsaXplZExhbmRtYXJrVG9WZWN0b3IodGhpcy5mYWNlTm9ybWFsKSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIC0xKSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgd2VpZ2h0TGVmdCA9IHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgZmFjZUNhbWVyYUFuZ2xlLnksXG4gICAgICAgICAgICBQb3Nlcy5MUl9GQUNFX0RJUkVDVElPTl9SQU5HRSxcbiAgICAgICAgICAgIC1Qb3Nlcy5MUl9GQUNFX0RJUkVDVElPTl9SQU5HRSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHdlaWdodFJpZ2h0ID0gcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICBmYWNlQ2FtZXJhQW5nbGUueSxcbiAgICAgICAgICAgIC1Qb3Nlcy5MUl9GQUNFX0RJUkVDVElPTl9SQU5HRSxcbiAgICAgICAgICAgIFBvc2VzLkxSX0ZBQ0VfRElSRUNUSU9OX1JBTkdFLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHsgd2VpZ2h0TGVmdCwgd2VpZ2h0UmlnaHQgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxSTGluayhsOiBudW1iZXIsIHI6IG51bWJlcikge1xuICAgICAgICBjb25zdCB7IHdlaWdodExlZnQsIHdlaWdodFJpZ2h0IH0gPSB0aGlzLmxSTGlua1dlaWdodHMoKTtcbiAgICAgICAgcmV0dXJuIHdlaWdodExlZnQgKiBsICsgd2VpZ2h0UmlnaHQgKiByO1xuICAgIH1cblxuICAgIHByaXZhdGUgbFJMaW5rVmVjdG9yKGw6IFZlY3RvcjMsIHI6IFZlY3RvcjMpIHtcbiAgICAgICAgY29uc3QgeyB3ZWlnaHRMZWZ0LCB3ZWlnaHRSaWdodCB9ID0gdGhpcy5sUkxpbmtXZWlnaHRzKCk7XG4gICAgICAgIHJldHVybiBsLnNjYWxlKHdlaWdodExlZnQpLmFkZEluUGxhY2Uoci5zY2FsZSh3ZWlnaHRSaWdodCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbFJMaW5rUXVhdGVybmlvbihsOiBRdWF0ZXJuaW9uLCByOiBRdWF0ZXJuaW9uKSB7XG4gICAgICAgIGNvbnN0IHsgd2VpZ2h0TGVmdCwgd2VpZ2h0UmlnaHQgfSA9IHRoaXMubFJMaW5rV2VpZ2h0cygpO1xuICAgICAgICByZXR1cm4gbC5zY2FsZSh3ZWlnaHRMZWZ0KS5hZGRJblBsYWNlKHIuc2NhbGUod2VpZ2h0UmlnaHQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRIYW5kQm9uZVJvdGF0aW9ucyhpc0xlZnQ6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gVE9ETzogYWRqdXN0IGJhc2VzXG4gICAgICAgIC8vIFdyaXN0J3MgYmFzaXMgaXMgdXNlZCBmb3IgY2FsY3VsYXRpbmcgcXVhdGVybmlvbiBiZXR3ZWVuIHR3byBDYXJ0ZXNpYW4gY29vcmRpbmF0ZSBzeXN0ZW1zIGRpcmVjdGx5XG4gICAgICAgIC8vIEFsbCBvdGhlcnMnIGFyZSB1c2VkIGZvciByb3RhdGluZyBwbGFuZXMgb2YgYSBTcGhlcmljYWwgY29vcmRpbmF0ZSBzeXN0ZW0gYXQgdGhlIG5vZGVcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXG4gICAgICAgICAgICBoYW5kTGFuZE1hcmtUb0JvbmVOYW1lKEhBTkRfTEFORE1BUktTLldSSVNULCBpc0xlZnQpXG4gICAgICAgIF0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgID8gZ2V0QmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAxKSxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAtMC45MzI3MTU5MDc5NTY4MDQxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAwLjEyMjgyNTIyNjE1NjU0MzgzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAtMC4zMzkwNTAxNDIxMDg2Njg1XG4gICAgICAgICAgICAgICAgICAgICAgKS5ub3JtYWxpemUoKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuMDEwMDAyMjEyNjc3MDc3MTgyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAwMjQ3Mjc2NDM0NTM4MjI5NDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDAuMDI4NDExNTUxOTI3NzQ3MzI3XG4gICAgICAgICAgICAgICAgICAgICAgKS5ub3JtYWxpemUoKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMC4xNDMyMDgwMTQxMTExMjg1NyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMC45ODkwNDk3OTI2OTQ5MDQ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAtMC4wMzU2NjQ3MjAxNjU5MDk4NFxuICAgICAgICAgICAgICAgICAgICAgICkubm9ybWFsaXplKCksXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICApO1xuICAgICAgICAvLyBUaHVtYlxuICAgICAgICAvLyBUSFVNQl9DTUNcbiAgICAgICAgLy8gVEhVTUJfTUNQXG4gICAgICAgIC8vIFRIVU1CX0lQXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB0TUNQX1ggPSBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIC0xLjUpLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgdE1DUF9ZID0gbmV3IFZlY3RvcjMoMCwgaXNMZWZ0ID8gLTEgOiAxLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IHRNQ1BfWiA9IFZlY3RvcjMuQ3Jvc3ModE1DUF9YLCB0TUNQX1kpLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgYmFzaXMgPSBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgIHRNQ1BfWCxcbiAgICAgICAgICAgICAgICAvLyBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgIHRNQ1BfWSxcbiAgICAgICAgICAgICAgICB0TUNQX1osXG4gICAgICAgICAgICBdKS5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgMCwgaXNMZWZ0ID8gMC4yIDogLTAuMilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1toYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGksIGlzTGVmdCldID1cbiAgICAgICAgICAgICAgICBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihRdWF0ZXJuaW9uLklkZW50aXR5KCksIGJhc2lzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJbmRleFxuICAgICAgICBmb3IgKGxldCBpID0gNTsgaSA8IDg7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNaWRkbGVcbiAgICAgICAgZm9yIChsZXQgaSA9IDk7IGkgPCAxMjsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1toYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGksIGlzTGVmdCldID1cbiAgICAgICAgICAgICAgICBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIGlzTGVmdCA/IC0xIDogMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJpbmdcbiAgICAgICAgZm9yIChsZXQgaSA9IDEzOyBpIDwgMTY7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBQaW5reVxuICAgICAgICBmb3IgKGxldCBpID0gMTc7IGkgPCAyMDsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1toYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGksIGlzTGVmdCldID1cbiAgICAgICAgICAgICAgICBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIGlzTGVmdCA/IC0xIDogMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0Qm9uZVJvdGF0aW9ucygpIHtcbiAgICAgICAgLy8gSGFuZCBib25lc1xuICAgICAgICB0aGlzLmluaXRIYW5kQm9uZVJvdGF0aW9ucyh0cnVlKTtcbiAgICAgICAgdGhpcy5pbml0SGFuZEJvbmVSb3RhdGlvbnMoZmFsc2UpO1xuXG4gICAgICAgIC8vIFBvc2UgYm9uZXNcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJoZWFkXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJuZWNrXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJoaXBzXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIC0xKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICBdKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcInNwaW5lXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIC0xKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICBdKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGxyID0gW1wibGVmdFwiLCBcInJpZ2h0XCJdO1xuICAgICAgICAvLyBBcm1zXG4gICAgICAgIGZvciAoY29uc3QgayBvZiBscikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfVVwcGVyQXJtYF0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcygwLCAwLCBpc0xlZnQgPyAxLjA0NzIgOiAtMS4wNDcyKSxcbiAgICAgICAgICAgICAgICBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW2Ake2t9TG93ZXJBcm1gXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBMZWdzXG4gICAgICAgIGZvciAoY29uc3QgayBvZiBscikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfVVwcGVyTGVnYF0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgLTEsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIC0xKSxcbiAgICAgICAgICAgICAgICBdKS5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uRnJvbUV1bGVyQW5nbGVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xlZnQgPyAtMC4wNTIzNiA6IDAuMDUyMzZcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfUxvd2VyTGVnYF0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgLTEsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIC0xKSxcbiAgICAgICAgICAgICAgICBdKS5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uRnJvbUV1bGVyQW5nbGVzKDAsIDAsIGlzTGVmdCA/IC0wLjA4NzMgOiAwLjA4NzMpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGZWV0XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBscikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICBjb25zdCBzdGFydEJhc2lzID0gbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAtMSwgMCksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDAsIC0xKSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgLy8gY29uc3QgclggPSBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyhzdGFydEJhc2lzLnguY2xvbmUoKSwgaXNMZWZ0ID8gMC4yNjE4IDogLTAuMjYxOCk7XG4gICAgICAgICAgICAvLyBjb25zdCB6MSA9IFZlY3RvcjMuWmVybygpO1xuICAgICAgICAgICAgLy8gc3RhcnRCYXNpcy56LnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKHJYLCB6MSk7XG4gICAgICAgICAgICAvLyBjb25zdCByWiA9IFF1YXRlcm5pb24uUm90YXRpb25BeGlzKHoxLCBpc0xlZnQgPyAwLjA4NzMgOiAtMC4wODczKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHRoaXNGb290QmFzaXNSb3RhdGlvbiA9IGlzTGVmdCA/IHRoaXMubGVmdEZvb3RCYXNpc1JvdGF0aW9uIDogdGhpcy5yaWdodEZvb3RCYXNpc1JvdGF0aW9uO1xuICAgICAgICAgICAgLy8gdGhpc0Zvb3RCYXNpc1JvdGF0aW9uLmNvcHlGcm9tKHJYLm11bHRpcGx5KHJaKSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW2Ake2t9Rm9vdGBdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgIHN0YXJ0QmFzaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFeHByZXNzaW9uc1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcIm1vdXRoXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJibGlua1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wibGVmdElyaXNcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcInJpZ2h0SXJpc1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiaXJpc1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRnJlZXplIGluaXQgb2JqZWN0XG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5faW5pdEJvbmVSb3RhdGlvbnMpO1xuXG4gICAgICAgIC8vIERlZXAgY29weSB0byBhY3R1YWwgbWFwXG4gICAgICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuX2luaXRCb25lUm90YXRpb25zKSkge1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1trXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24odiksXG4gICAgICAgICAgICAgICAgdi5iYXNlQmFzaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBub3JtYWxGcm9tVmVydGljZXMoXG4gICAgICAgIHZlcnRpY2VzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yMyxcbiAgICAgICAgcmV2ZXJzZTogYm9vbGVhblxuICAgICk6IFZlY3RvcjMge1xuICAgICAgICBpZiAocmV2ZXJzZSkgdmVydGljZXMucmV2ZXJzZSgpO1xuICAgICAgICBjb25zdCB2ZWMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyArK2kpIHtcbiAgICAgICAgICAgIHZlYy5wdXNoKHZlcnRpY2VzW2kgKyAxXS5wb3Muc3VidHJhY3QodmVydGljZXNbaV0ucG9zKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlY1swXS5jcm9zcyh2ZWNbMV0pLm5vcm1hbGl6ZSgpO1xuICAgIH1cblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGFwcGx5IHByZXZpb3VzIHF1YXRlcm5pb25zIHRvIGN1cnJlbnQgYmFzaXNcbiAgICBwcml2YXRlIGFwcGx5UXVhdGVybmlvbkNoYWluKFxuICAgICAgICBzdGFydExhbmRtYXJrOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgICAgIGlzTGVmdDogYm9vbGVhblxuICAgICk6IFF1YXRlcm5pb24ge1xuICAgICAgICBjb25zdCBxID0gUXVhdGVybmlvbi5JZGVudGl0eSgpO1xuICAgICAgICBjb25zdCByb3RhdGlvbnM6IFF1YXRlcm5pb25bXSA9IFtdO1xuICAgICAgICBsZXQgW3N0YXJ0Tm9kZSwgcGFyZW50TWFwXTogW1xuICAgICAgICAgICAgVHJhbnNmb3JtTm9kZVRyZWVOb2RlLFxuICAgICAgICAgICAgTWFwPFRyYW5zZm9ybU5vZGVUcmVlTm9kZSwgVHJhbnNmb3JtTm9kZVRyZWVOb2RlPlxuICAgICAgICBdID0gZGVwdGhGaXJzdFNlYXJjaChcbiAgICAgICAgICAgIHRoaXMuYm9uZXNIaWVyYXJjaHlUcmVlLFxuICAgICAgICAgICAgKG46IFRyYW5zZm9ybU5vZGVUcmVlTm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldE5hbWUgPSBOdW1iZXIuaXNGaW5pdGUoc3RhcnRMYW5kbWFyaylcbiAgICAgICAgICAgICAgICAgICAgPyBoYW5kTGFuZE1hcmtUb0JvbmVOYW1lKHN0YXJ0TGFuZG1hcmsgYXMgbnVtYmVyLCBpc0xlZnQpXG4gICAgICAgICAgICAgICAgICAgIDogc3RhcnRMYW5kbWFyaztcbiAgICAgICAgICAgICAgICByZXR1cm4gbi5uYW1lID09PSB0YXJnZXROYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB3aGlsZSAocGFyZW50TWFwLmhhcyhzdGFydE5vZGUpKSB7XG4gICAgICAgICAgICBzdGFydE5vZGUgPSBwYXJlbnRNYXAuZ2V0KHN0YXJ0Tm9kZSkhO1xuICAgICAgICAgICAgY29uc3QgYm9uZVF1YXRlcm5pb24gPSB0aGlzLl9ib25lUm90YXRpb25zW3N0YXJ0Tm9kZS5uYW1lXTtcbiAgICAgICAgICAgIHJvdGF0aW9ucy5wdXNoKFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVhYmxlUXVhdGVybmlvblRvUXVhdGVybmlvbihib25lUXVhdGVybmlvbiksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFF1YXRlcm5pb25zIG5lZWQgdG8gYmUgYXBwbGllZCBmcm9tIHBhcmVudCB0byBjaGlsZHJlblxuICAgICAgICByb3RhdGlvbnMucmV2ZXJzZSgpLm1hcCgodHE6IFF1YXRlcm5pb24pID0+IHtcbiAgICAgICAgICAgIHEubXVsdGlwbHlJblBsYWNlKHRxKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHEubm9ybWFsaXplKCk7XG5cbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaGFsbFVwZGF0ZUFybShpc0xlZnQ6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gVXBkYXRlIG9ubHkgd2hlbiBhbGwgbGVnIGxhbmRtYXJrcyBhcmUgdmlzaWJsZVxuICAgICAgICBjb25zdCBzaG91bGRlclZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1MuTEVGVF9TSE9VTERFUlxuICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTLlJJR0hUX1NIT1VMREVSXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3Qgd3Jpc3RWaXNpbGliaXR5ID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgIGlzTGVmdCA/IFBPU0VfTEFORE1BUktTLkxFRlRfV1JJU1QgOiBQT1NFX0xBTkRNQVJLUy5SSUdIVF9XUklTVFxuICAgICAgICAgICAgXS52aXNpYmlsaXR5IHx8IDA7XG4gICAgICAgIHJldHVybiAhKFxuICAgICAgICAgICAgc2hvdWxkZXJWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEIHx8XG4gICAgICAgICAgICB3cmlzdFZpc2lsaWJpdHkgPD0gVklTSUJJTElUWV9USFJFU0hPTERcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNoYWxsVXBkYXRlTGVncyhpc0xlZnQ6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gVXBkYXRlIG9ubHkgd2hlbiBhbGwgbGVnIGxhbmRtYXJrcyBhcmUgdmlzaWJsZVxuICAgICAgICBjb25zdCBrbmVlVmlzaWxpYml0eSA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICBpc0xlZnRcbiAgICAgICAgICAgICAgICAgICAgPyBQT1NFX0xBTkRNQVJLU19MRUZULkxFRlRfS05FRVxuICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0tORUVcbiAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwO1xuICAgICAgICBjb25zdCBhbmtsZVZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0FOS0xFXG4gICAgICAgICAgICAgICAgICAgIDogUE9TRV9MQU5ETUFSS1NfUklHSFQuUklHSFRfQU5LTEVcbiAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwO1xuICAgICAgICBjb25zdCBmb290VmlzaWxpYml0eSA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICBpc0xlZnRcbiAgICAgICAgICAgICAgICAgICAgPyBQT1NFX0xBTkRNQVJLU19MRUZULkxFRlRfRk9PVF9JTkRFWFxuICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0ZPT1RfSU5ERVhcbiAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwO1xuICAgICAgICBjb25zdCBoZWVsVmlzaWxpYml0eSA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICBpc0xlZnRcbiAgICAgICAgICAgICAgICAgICAgPyBQT1NFX0xBTkRNQVJLU19MRUZULkxFRlRfSEVFTFxuICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0hFRUxcbiAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwO1xuICAgICAgICByZXR1cm4gIShcbiAgICAgICAgICAgIGtuZWVWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEIHx8XG4gICAgICAgICAgICBhbmtsZVZpc2lsaWJpdHkgPD0gVklTSUJJTElUWV9USFJFU0hPTEQgfHxcbiAgICAgICAgICAgIGZvb3RWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEIHx8XG4gICAgICAgICAgICBoZWVsVmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHVzaEJvbmVSb3RhdGlvbkJ1ZmZlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ib25lUm90YXRpb25VcGRhdGVGbikgcmV0dXJuO1xuXG4gICAgICAgIC8vIENhbGxiYWNrXG4gICAgICAgIGNvbnN0IGpzb25TdHIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9ib25lUm90YXRpb25zKTtcbiAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSB0aGlzLnRleHRFbmNvZGVyLmVuY29kZShqc29uU3RyKTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uVXBkYXRlRm4oXG4gICAgICAgICAgICBDb21saW5rLnRyYW5zZmVyKGFycmF5QnVmZmVyLCBbYXJyYXlCdWZmZXIuYnVmZmVyXSlcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBwb3NlV3JhcHBlciA9IHtcbiAgICBwb3NlczogUG9zZXMsXG59O1xuXG5Db21saW5rLmV4cG9zZShwb3NlV3JhcHBlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFBvc2VzO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyB0aGUgc3RhcnR1cCBmdW5jdGlvblxuX193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcblx0Ly8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG5cdHZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfbWVkaWFwaXBlX2hvbGlzdGljX2hvbGlzdGljX2pzLW5vZGVfbW9kdWxlc19rYWxtYW5qc19saWJfa2FsbWFuX2pzLW5vZGVfLTE2NGY5YlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93b3JrZXIvcG9zZS1wcm9jZXNzaW5nLnRzXCIpKSlcblx0X193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcblx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG59O1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3MgYW5kIHNpYmxpbmcgY2h1bmtzIGZvciB0aGUgZW50cnlwb2ludFxuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLnRlc3QuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInNyY193b3JrZXJfcG9zZS1wcm9jZXNzaW5nX3RzXCI6IDFcbn07XG5cbi8vIGltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZ1xudmFyIGluc3RhbGxDaHVuayA9IChkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0d2hpbGUoY2h1bmtJZHMubGVuZ3RoKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkcy5wb3AoKV0gPSAxO1xuXHRwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcbn07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbXBvcnRTY3JpcHRzKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3YzZF93ZWJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rdjNkX3dlYlwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gaW5zdGFsbENodW5rO1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwidmFyIG5leHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLng7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19tZWRpYXBpcGVfaG9saXN0aWNfaG9saXN0aWNfanMtbm9kZV9tb2R1bGVzX2thbG1hbmpzX2xpYl9rYWxtYW5fanMtbm9kZV8tMTY0ZjliXCIpLnRoZW4obmV4dCk7XG59OyIsIiIsIi8vIHJ1biBzdGFydHVwXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9