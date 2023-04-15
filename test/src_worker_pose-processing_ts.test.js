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
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_mediapipe_holistic_holistic_js-node_modules_kalmanjs_lib_kalman_js-node_-ff605e"], () => (__webpack_require__("./src/worker/pose-processing.ts")))
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
/******/ 	/* webpack/runtime/get css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.k = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".test.css";
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
/******/ 			return __webpack_require__.e("vendors-node_modules_mediapipe_holistic_holistic_js-node_modules_kalmanjs_lib_kalman_js-node_-ff605e").then(next);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcl9wb3NlLXByb2Nlc3NpbmdfdHMudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILHlCQUF5QjtBQUM0QztBQUNWO0FBQ1o7QUFJeEMsTUFBTSxLQUFLO0lBU2QsSUFBSSxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsWUFDSSxHQUF1QixFQUNOLGFBQWEsSUFBSSxFQUMxQixNQUFNLElBQUk7UUFERCxlQUFVLEdBQVYsVUFBVSxDQUFPO1FBQzFCLFFBQUcsR0FBSCxHQUFHLENBQU87UUFqQkwsVUFBSyxHQUFhLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBbUIvRCxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxvREFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFTSxHQUFHO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTyxHQUFHLENBQUMsR0FBYTtRQUNyQixJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLFdBQVc7UUFDZCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxvRUFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDM0QsTUFBTSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sa0JBQWtCLENBQUMsQ0FBYTtRQUNuQyxNQUFNLGVBQWUsR0FBYSxDQUFDLHlEQUFZLEVBQUUsRUFBRSx5REFBWSxFQUFFLEVBQUUseURBQVksRUFBRSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEIsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELGlDQUFpQztJQUMxQixVQUFVLENBQUMsSUFBVTtRQUN4QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6QixRQUFRLElBQUksRUFBRTtZQUNWLEtBQUssK0NBQU07Z0JBQ1AsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixNQUFNO1lBQ1YsS0FBSywrQ0FBTTtnQkFDUCxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU07WUFDVixLQUFLLCtDQUFNO2dCQUNQLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssZ0RBQU87Z0JBQ1IsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU07WUFDVixLQUFLLGdEQUFPO2dCQUNSLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixNQUFNO1lBQ1YsS0FBSyxnREFBTztnQkFDUixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssaURBQVE7Z0JBQ1QsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsTUFBTTtZQUNWO2dCQUNJLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sU0FBUyxDQUFDLEtBQStCO1FBQzVDLGVBQWU7UUFDZixJQUFJLENBQUMsZ0RBQVEsQ0FBUyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZELE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUN0RCxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQWEsQ0FBQztRQUVwRCxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTyxNQUFNLENBQUMsdUJBQXVCO1FBQ2xDLE9BQU8sS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBYSxDQUFDO0lBQ2xGLENBQUM7O0FBaEh1QixzQ0FBZ0MsR0FBYTtJQUNqRSxJQUFJLG9EQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEIsSUFBSSxvREFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLElBQUksb0RBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUN2QixDQUFDO0FBK0dDLFNBQVMsc0JBQXNCLENBQ2xDLE1BQWEsRUFDYixNQUFhLEVBQ2IsY0FBMkI7SUFFM0IsSUFBSSxVQUFVLEdBQUcsTUFBTSxFQUFFLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFDN0MsSUFBSSxjQUFjLEtBQUssU0FBUyxFQUFFO1FBQzlCLE1BQU0sZ0JBQWdCLEdBQUcsK0RBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUQsVUFBVSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pELFVBQVUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUM1RDtJQUNELE1BQU0sY0FBYyxHQUFHLGtGQUFxQyxDQUN4RCxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUNwQixVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUNwQixVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDMUIsTUFBTSxjQUFjLEdBQUcsa0ZBQXFDLENBQ3hELFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQ3BCLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQ3BCLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUUxQixNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEQsTUFBTSxhQUFhLEdBQUcsK0RBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3hELE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLFNBQVMsUUFBUSxDQUFDLEdBQWE7SUFDbEMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLDZEQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN4QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzdCLG9CQUFvQjtJQUNwQixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUNaLEtBQUssQ0FBQyxLQUFLLENBQUMsd0RBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLHdEQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQzdFLENBQUM7SUFDRixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3pDLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELHFDQUFxQztBQUM5QixTQUFTLFlBQVksQ0FBQyxHQUFjLEVBQUUsTUFBZTtJQUN4RCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUFFLE9BQU8sQ0FBQyx5REFBWSxFQUFFLENBQUMsQ0FBQztJQUM5QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDdEIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0RBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbk1EOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRXNDO0FBQ0w7QUFFN0IsTUFBTSxvQkFBb0IsR0FBVyxHQUFHLENBQUM7QUFXaEQscUJBQXFCO0FBQ2QsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDO0lBQzdCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVwQyxPQUFPLFNBQVMsZ0JBQWdCLENBQUUsSUFBWSxFQUFFLEtBQWE7UUFDekQsNENBQTRDO1FBQzVDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDdEIsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ2pDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQzdCLFdBQVcsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssRUFDL0IsS0FBSyxHQUFHLENBQUMsRUFDVCxDQUFDLENBQUM7UUFFTixpQ0FBaUM7UUFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QixLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDdEU7UUFFRCx1RUFBdUU7UUFDdkUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUM7U0FDdEI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDLENBQUM7QUFDTixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRUw7O0dBRUc7QUFDSSxNQUFNLG1CQUFtQjtJQUM1QixZQUNXLE1BQWMsRUFDZCxNQUFlLEVBQ2QsVUFBVSx5REFBWSxFQUFFLEVBQ3pCLGFBQWEsR0FBRyxFQUNoQixPQUFPLEdBQUcsRUFDVixXQUFXLEdBQUc7UUFMZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUNkLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3pCLGVBQVUsR0FBVixVQUFVLENBQU07UUFDaEIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLGFBQVEsR0FBUixRQUFRLENBQU07SUFFekIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFXLEVBQUUsTUFBYztRQUN2RCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBUyxFQUFFLENBQVUsRUFBRSxNQUFlO1FBQ3ZFLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBVTtRQUM3QixNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUU1Qix5Q0FBeUM7UUFDekMsTUFBTSxHQUFHLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhGLHVCQUF1QjtRQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdELE1BQU0sQ0FBQyxHQUFHLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RCxNQUFNLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRSxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFaEIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBQ00sTUFBTSxrQkFBa0I7SUFJM0IsWUFDVyxJQUFJLEdBQUcsRUFDUCxJQUFJLENBQUM7UUFETCxNQUFDLEdBQUQsQ0FBQyxDQUFNO1FBQ1AsTUFBQyxHQUFELENBQUMsQ0FBSTtRQUVaLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxpREFBWSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksaURBQVksQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGlEQUFZLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxJQUFJLENBQUMsQ0FBUyxFQUFFLEdBQVk7UUFDL0IsTUFBTSxTQUFTLEdBQUc7WUFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuQztRQUVELE9BQU8sOERBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNKO0FBRU0sTUFBTSxvQkFBb0I7SUFFN0IsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFHRCxZQUNvQixJQUFZLEVBQ1gsS0FBYTtRQURkLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBUjFCLFlBQU8sR0FBYyxFQUFFLENBQUM7UUFVNUIsSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUFFLE1BQU0sVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxJQUFJLENBQUMsQ0FBVTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdkI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0NBQStDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVNLEtBQUs7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLEtBQUs7UUFDUixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTyx5REFBWSxFQUFFLENBQUM7UUFDNUQsTUFBTSxHQUFHLEdBQUcseURBQVksRUFBRSxDQUFDO1FBQzNCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNoQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLCtCQUErQjtRQUMvQixHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUU5QixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQUVNLE1BQU0sdUJBQXVCO0lBRWhDLElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsWUFDcUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQU45QixXQUFNLEdBQVkseURBQVksRUFBRSxDQUFDO0lBT3RDLENBQUM7SUFFRyxNQUFNLENBQUMsQ0FBVTtRQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDbkI7SUFDTCxDQUFDO0lBRU0sS0FBSztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcseURBQVksRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlMRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUcrQztBQU9oQztBQUNpQjtBQUU1QixNQUFNLHNCQUFzQjtJQUsvQixJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEtBQWE7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBR0QsSUFBSSxHQUFHO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFJRCxZQUNJLFNBQXVCO1FBQ25CLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFdBQVcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxFQUFFLFNBQVM7S0FDbEI7UUF2QlkseUJBQW9CLEdBQW1DLElBQUksQ0FBQztRQUVyRSxPQUFFLEdBQUcsQ0FBQyxDQUFDO1FBU1AsU0FBSSxHQUFHLHlEQUFZLEVBQUUsQ0FBQztRQUt2QixlQUFVLEdBQXVCLENBQUMsQ0FBQztRQVN0QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUTtZQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdURBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUQsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHdEQUFtQixDQUNyQyxJQUFJLENBQUMsQ0FBQyxFQUNOLElBQUksQ0FBQyxHQUFHLEVBQ1IseURBQVksRUFBRSxFQUNkLE1BQU0sQ0FBQyxhQUFhLEVBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7WUFFeEIsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sQ0FBQyxhQUFhO1lBQ3BCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLHlEQUFvQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVNLGNBQWMsQ0FBQyxHQUFZLEVBQUUsVUFBbUI7UUFDbkQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFWiw4QkFBOEI7UUFDOUIsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsR0FBRyx5REFBb0IsRUFBRTtZQUMvRCxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV4QyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUMzQztZQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBRWhCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztDQUNKO0FBYU0sTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUM7QUFDakMsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFFaEMsTUFBTSwwQkFBMEIsR0FBRyxDQUN0QyxDQUFxQixFQUNyQixPQUFPLEdBQUcsRUFBRSxFQUNaLFFBQVEsR0FBRyxLQUFLLEVBQUUsRUFBRTtJQUNwQixPQUFPLElBQUksb0RBQU8sQ0FDZCxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFDYixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUN6QyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFDTSxNQUFNLDBCQUEwQixHQUFHLENBQUMsQ0FBVSxFQUFzQixFQUFFO0lBQ3pFLE9BQU8sRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVLLE1BQU0sY0FBYyxHQUFHO0lBQzFCLEtBQUssRUFBRSxDQUFDO0lBQ1IsU0FBUyxFQUFFLENBQUM7SUFDWixTQUFTLEVBQUUsQ0FBQztJQUNaLFFBQVEsRUFBRSxDQUFDO0lBQ1gsU0FBUyxFQUFFLENBQUM7SUFDWixnQkFBZ0IsRUFBRSxDQUFDO0lBQ25CLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixnQkFBZ0IsRUFBRSxDQUFDO0lBQ25CLGlCQUFpQixFQUFFLENBQUM7SUFDcEIsaUJBQWlCLEVBQUUsRUFBRTtJQUNyQixpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCLGlCQUFpQixFQUFFLEVBQUU7SUFDckIsZUFBZSxFQUFFLEVBQUU7SUFDbkIsZUFBZSxFQUFFLEVBQUU7SUFDbkIsZUFBZSxFQUFFLEVBQUU7SUFDbkIsZUFBZSxFQUFFLEVBQUU7SUFDbkIsU0FBUyxFQUFFLEVBQUU7SUFDYixTQUFTLEVBQUUsRUFBRTtJQUNiLFNBQVMsRUFBRSxFQUFFO0lBQ2IsU0FBUyxFQUFFLEVBQUU7Q0FDaEIsQ0FBQztBQUVLLE1BQU0sMkJBQTJCLEdBQUc7SUFDdkMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxLQUFLO0lBQzFCLGFBQWEsRUFBRSxjQUFjLENBQUMsU0FBUztJQUN2QyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsU0FBUztJQUMzQyxXQUFXLEVBQUUsY0FBYyxDQUFDLFFBQVE7SUFDcEMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxnQkFBZ0I7SUFDOUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtJQUNsRCxXQUFXLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtJQUM1QyxjQUFjLEVBQUUsY0FBYyxDQUFDLGlCQUFpQjtJQUNoRCxrQkFBa0IsRUFBRSxjQUFjLENBQUMsaUJBQWlCO0lBQ3BELFlBQVksRUFBRSxjQUFjLENBQUMsaUJBQWlCO0lBQzlDLFlBQVksRUFBRSxjQUFjLENBQUMsZUFBZTtJQUM1QyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsZUFBZTtJQUNoRCxVQUFVLEVBQUUsY0FBYyxDQUFDLGVBQWU7SUFDMUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxTQUFTO0lBQ3hDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxTQUFTO0lBQzVDLFlBQVksRUFBRSxjQUFjLENBQUMsU0FBUztDQUN6QyxDQUFDO0FBQ0ssTUFBTSxtQ0FBbUMsR0FBOEIsa0RBQVUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRy9HLFNBQVMsc0JBQXNCLENBQUMsUUFBZ0IsRUFBRSxNQUFlO0lBQ3BFLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxtQ0FBbUMsQ0FBQztRQUFFLE1BQU0sS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDN0YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxtQ0FBbUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBRUQ7OztHQUdHO0FBQ0ksU0FBUyxnQkFBZ0IsQ0FDNUIsUUFBYSxFQUNiLENBQXNCO0lBRXRCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNqQixNQUFNLFNBQVMsR0FBa0IsSUFBSSxHQUFHLEVBQVksQ0FBQztJQUNyRCxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXJCLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdkIsc0NBQXNDO1FBQ3RDLE1BQU0sV0FBVyxHQUFRLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlCLElBQUksTUFBTTtZQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFNUMsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUM3Qyx1REFBdUQ7UUFDdkQsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO1lBQzFCLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN6RCxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDekIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7aUJBQ3JDO2FBQ0o7U0FDSjtLQUNKO0lBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JNRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUV5RTtBQUMzQztBQUNxQjtBQUNBO0FBS3BDO0FBRVgsTUFBTSx1QkFBdUI7SUFNaEMsWUFDSSxDQUF1QjtRQU5wQixNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBS2pCLElBQUksQ0FBQyxFQUFFO1lBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztDQUNKO0FBRU0sTUFBTSxtQkFBb0IsU0FBUSx1QkFBdUI7SUFFNUQsSUFBSSxTQUFTO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFRCxZQUNJLENBQXVCLEVBQ3ZCLEtBQWE7UUFFYixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLHlDQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLEdBQUcsQ0FBQyxDQUFhO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRU0sV0FBVyxDQUFDLENBQWE7UUFDNUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSjtBQU9NLE1BQU0sK0JBQStCLEdBQUcsQ0FBQyxDQUEwQixFQUFjLEVBQUU7SUFDdEYsTUFBTSxHQUFHLEdBQUcsSUFBSSx1REFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVLLE1BQU0sa0JBQWtCO0lBSzNCLElBQUksQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQUMsS0FBYTtRQUNmLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFHRCxJQUFJLEdBQUc7UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELFlBQ0ksU0FBdUI7UUFDbkIsQ0FBQyxFQUFFLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztRQUNKLElBQUksRUFBRSxRQUFRO0tBQ2pCO1FBcEJZLHlCQUFvQixHQUFtQyxJQUFJLENBQUM7UUFFckUsT0FBRSxHQUFHLENBQUMsQ0FBQztRQVFQLFNBQUksR0FBRyxnRUFBbUIsRUFBRSxDQUFDO1FBWWpDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRO1lBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1REFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFFN0QsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sQ0FBQyxhQUFhO1lBQ3BCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLHlEQUFvQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVNLGNBQWMsQ0FBQyxHQUFlO1FBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzNCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM5QztRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsdUVBQTBCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKO0FBS0QsSUFBWSxJQVNYO0FBVEQsV0FBWSxJQUFJO0lBQ1oseUJBQUM7SUFDRCx5QkFBQztJQUNELHlCQUFDO0lBQ0QsMkJBQUU7SUFDRiwyQkFBRTtJQUNGLDJCQUFFO0lBQ0YsNkJBQUc7SUFDSCxnQ0FBUztBQUNiLENBQUMsRUFUVyxJQUFJLEtBQUosSUFBSSxRQVNmO0FBRUQsd0JBQXdCO0FBQ2pCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUU7SUFDbEMsT0FBTyw4REFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxQyxDQUFDO0FBQ00sTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRTtJQUNsQyxPQUFPLDhEQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFDLENBQUM7QUFFRDs7O0dBR0c7QUFDSSxTQUFTLGVBQWUsQ0FBQyxDQUFhO0lBQ3pDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEcsQ0FBQztBQUVELG9EQUFvRDtBQUM3QyxNQUFNLHdCQUF3QixHQUFHLENBQ3BDLEVBQVcsRUFBRSxFQUFXLEVBQ2QsRUFBRTtJQUNaLE1BQU0sS0FBSyxHQUFHLDJFQUE4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsMERBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0UsTUFBTSxJQUFJLEdBQUcsMERBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pCLE9BQU8sb0VBQXVCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQztBQUNGOzs7OztHQUtHO0FBQ0ksTUFBTSxvQkFBb0IsR0FBRyxDQUNoQyxFQUFXLEVBQUUsRUFBVyxFQUFFLFdBQVcsR0FBRyxLQUFLLEVBQy9DLEVBQUU7SUFDQSxPQUFPLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM5RSxDQUFDLENBQUM7QUFDRjs7O0dBR0c7QUFDSSxNQUFNLGtCQUFrQixHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7SUFDOUMsR0FBRyxHQUFHLGdEQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QixPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN2QyxDQUFDO0FBQ0Q7Ozs7R0FJRztBQUNJLE1BQU0sbUJBQW1CLEdBQUcsQ0FDL0IsQ0FBYSxFQUNiLFdBQVcsR0FBRyxLQUFLLEVBQ3JCLEVBQUU7SUFDQSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakMsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRSxPQUFPLElBQUksb0RBQU8sQ0FDZCxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMzQixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMzQixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM5QixDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSSxTQUFTLHVCQUF1QixDQUFDLEVBQVcsRUFBRSxFQUFXLEVBQUUsR0FBRyxHQUFHLElBQUk7SUFDeEUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsSUFBSSx3REFBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSSxTQUFTLDRCQUE0QixDQUFDLEVBQWMsRUFBRSxFQUFjO0lBQ3ZFLE1BQU0sT0FBTyxHQUFHLHdEQUFXLEVBQUUsQ0FBQztJQUM5QixNQUFNLFFBQVEsR0FBRyx5REFBWSxFQUFFLENBQUM7SUFDaEMsTUFBTSxRQUFRLEdBQUcsd0RBQVcsRUFBRSxDQUFDO0lBQy9CLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxPQUFPLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLFNBQVMsd0JBQXdCLENBQ3BDLEVBQVcsRUFBRSxFQUFXO0lBRXhCLE1BQU0sRUFBRSxHQUFHLHVFQUEwQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsTUFBTSxFQUFFLEdBQUcsdUVBQTBCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixPQUFPLDRCQUE0QixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBYSxFQUFFLElBQVUsRUFBRSxFQUFFO0lBQ3pELElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDakMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxFQUFFO1FBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNSLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsR0FBRztZQUNULE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU07UUFDVjtZQUNJLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3BDO0lBQ0QsT0FBTyw0RUFBK0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFDRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSSxNQUFNLHlCQUF5QixHQUFHLENBQ3JDLENBQWEsRUFDYixJQUFVLEVBQ1YsUUFBZSxFQUNmLE9BQWdCLEVBQ2hCLFFBQWlCLEVBQ2pCLFFBQWUsRUFDZixPQUFnQixFQUNoQixRQUFpQixFQUNuQixFQUFFO0lBQ0EsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVDLFFBQVEsSUFBSSxFQUFFO1FBQ1YsS0FBSyxJQUFJLENBQUMsSUFBSTtZQUNWLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxHQUFHO1lBQ1QsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWO1lBQ0ksTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDcEM7SUFDRCxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1FBQzNFLFFBQVEsUUFBZ0IsRUFBRTtZQUN0QixLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsZ0RBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDakQsTUFBTTtZQUNWLEtBQUssSUFBSSxDQUFDLENB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LElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYztZQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO1lBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFOUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxD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eUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7Ozs7O1dDUkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsYUFBYTtXQUNiO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7Ozs7V0NwQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSEE7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3YzZC13ZWIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvaGVscGVyL2Jhc2lzLnRzIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvaGVscGVyL2ZpbHRlci50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci9sYW5kbWFyay50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci9xdWF0ZXJuaW9uLnRzIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvaGVscGVyL3V0aWxzLnRzIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvd29ya2VyL3Bvc2UtcHJvY2Vzc2luZy50cyIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9nZXQgY3NzIGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvaW1wb3J0U2NyaXB0cyBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL3N0YXJ0dXAgY2h1bmsgZGVwZW5kZW5jaWVzIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ2M2Qtd2ViXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInYzZC13ZWJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMiAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vLyBDYWxjdWxhdGUgM0Qgcm90YXRpb25zXG5pbXBvcnQge051bGxhYmxlLCBQbGFuZSwgUXVhdGVybmlvbiwgVmVjdG9yM30gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IHtBWElTLCB2ZWN0b3JzU2FtZURpcldpdGhpbkVwc30gZnJvbSBcIi4vcXVhdGVybmlvblwiO1xuaW1wb3J0IHtzZXRFcXVhbCwgdmFsaWRWZWN0b3IzfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgdHlwZSBWZWN0b3IzMyA9IFtWZWN0b3IzLCBWZWN0b3IzLCBWZWN0b3IzXTtcblxuZXhwb3J0IGNsYXNzIEJhc2lzIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBPUklHSU5BTF9DQVJURVNJQU5fQkFTSVNfVkVDVE9SUzogVmVjdG9yMzMgPSBbXG4gICAgICAgIG5ldyBWZWN0b3IzKDEsIDAsIDApLFxuICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgMSksXG4gICAgXTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2RhdGE6IFZlY3RvcjMzID0gQmFzaXMuZ2V0T3JpZ2luYWxDb29yZFZlY3RvcnMoKTtcblxuICAgIGdldCB4KCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVswXTtcbiAgICB9XG5cbiAgICBnZXQgeSgpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbMV07XG4gICAgfVxuXG4gICAgZ2V0IHooKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhWzJdO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICB2MzM6IE51bGxhYmxlPFZlY3RvcjMzPixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBsZWZ0SGFuZGVkID0gdHJ1ZSxcbiAgICAgICAgcHJpdmF0ZSBlcHMgPSAxZS02XG4gICAgKSB7XG4gICAgICAgIGlmICh2MzMgJiYgdjMzLmV2ZXJ5KCh2KSA9PiB2YWxpZFZlY3RvcjModikpKVxuICAgICAgICAgICAgdGhpcy5zZXQodjMzKTtcbiAgICAgICAgdGhpcy5fZGF0YS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHYpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0KHYzMzogVmVjdG9yMzMpIHtcbiAgICAgICAgdGhpcy54LmNvcHlGcm9tKHYzM1swXSk7XG4gICAgICAgIHRoaXMueS5jb3B5RnJvbSh2MzNbMV0pO1xuICAgICAgICB0aGlzLnouY29weUZyb20odjMzWzJdKTtcblxuICAgICAgICB0aGlzLnZlcmlmeUJhc2lzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHZlcmlmeUJhc2lzKCkge1xuICAgICAgICBjb25zdCB6ID0gdGhpcy5sZWZ0SGFuZGVkID8gdGhpcy56IDogdGhpcy56Lm5lZ2F0ZSgpO1xuICAgICAgICBpZiAoIXZlY3RvcnNTYW1lRGlyV2l0aGluRXBzKHRoaXMueC5jcm9zcyh0aGlzLnkpLCB6LCB0aGlzLmVwcykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkJhc2lzIGlzIG5vdCBjb3JyZWN0IVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcm90YXRlQnlRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24pOiBCYXNpcyB7XG4gICAgICAgIGNvbnN0IG5ld0Jhc2lzVmVjdG9yczogVmVjdG9yMzMgPSBbVmVjdG9yMy5aZXJvKCksIFZlY3RvcjMuWmVybygpLCBWZWN0b3IzLlplcm8oKV07XG4gICAgICAgIHRoaXMuX2RhdGEubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICB2LnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKHEsIG5ld0Jhc2lzVmVjdG9yc1tpXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IEJhc2lzKG5ld0Jhc2lzVmVjdG9ycyk7XG4gICAgfVxuXG4gICAgLy8gQmFzaXMgdmFsaWRpdHkgaXMgbm90IGNoZWNrZWQhXG4gICAgcHVibGljIG5lZ2F0ZUF4ZXMoYXhpczogQVhJUykge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy54LmNsb25lKCk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnkuY2xvbmUoKTtcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuei5jbG9uZSgpO1xuICAgICAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgICAgICAgIGNhc2UgQVhJUy54OlxuICAgICAgICAgICAgICAgIHgubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBWElTLnk6XG4gICAgICAgICAgICAgICAgeS5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMuejpcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy54eTpcbiAgICAgICAgICAgICAgICB4Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB5Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy55ejpcbiAgICAgICAgICAgICAgICB5Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy54ejpcbiAgICAgICAgICAgICAgICB4Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy54eXo6XG4gICAgICAgICAgICAgICAgeC5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgeS5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgei5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBheGlzIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgQmFzaXMoW3gsIHksIHpdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJhbnNwb3NlKG9yZGVyOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcbiAgICAgICAgLy8gU2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghc2V0RXF1YWw8bnVtYmVyPihuZXcgU2V0KG9yZGVyKSwgbmV3IFNldChbMCwgMSwgMl0pKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkJhc2lzIHRyYW5zcG9zZSBmYWlsZWQ6IHdyb25nIGlucHV0LlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IFt0aGlzLnguY2xvbmUoKSwgdGhpcy55LmNsb25lKCksIHRoaXMuei5jbG9uZSgpXTtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG9yZGVyLm1hcChpID0+IGRhdGFbaV0pIGFzIFZlY3RvcjMzO1xuXG4gICAgICAgIHJldHVybiBuZXcgQmFzaXMobmV3RGF0YSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0T3JpZ2luYWxDb29yZFZlY3RvcnMoKTogVmVjdG9yMzMge1xuICAgICAgICByZXR1cm4gQmFzaXMuT1JJR0lOQUxfQ0FSVEVTSUFOX0JBU0lTX1ZFQ1RPUlMubWFwKHYgPT4gdi5jbG9uZSgpKSBhcyBWZWN0b3IzMztcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWF0ZXJuaW9uQmV0d2VlbkJhc2VzKFxuICAgIGJhc2lzMTogQmFzaXMsXG4gICAgYmFzaXMyOiBCYXNpcyxcbiAgICBwcmV2UXVhdGVybmlvbj86IFF1YXRlcm5pb25cbikge1xuICAgIGxldCB0aGlzQmFzaXMxID0gYmFzaXMxLCB0aGlzQmFzaXMyID0gYmFzaXMyO1xuICAgIGlmIChwcmV2UXVhdGVybmlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhUXVhdGVybmlvblIgPSBRdWF0ZXJuaW9uLkludmVyc2UocHJldlF1YXRlcm5pb24pO1xuICAgICAgICB0aGlzQmFzaXMxID0gYmFzaXMxLnJvdGF0ZUJ5UXVhdGVybmlvbihleHRyYVF1YXRlcm5pb25SKTtcbiAgICAgICAgdGhpc0Jhc2lzMiA9IGJhc2lzMi5yb3RhdGVCeVF1YXRlcm5pb24oZXh0cmFRdWF0ZXJuaW9uUik7XG4gICAgfVxuICAgIGNvbnN0IHJvdGF0aW9uQmFzaXMxID0gUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgdGhpc0Jhc2lzMS54LmNsb25lKCksXG4gICAgICAgIHRoaXNCYXNpczEueS5jbG9uZSgpLFxuICAgICAgICB0aGlzQmFzaXMxLnouY2xvbmUoKSk7XG4gICAgY29uc3Qgcm90YXRpb25CYXNpczIgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uUXVhdGVybmlvbkZyb21BeGlzKFxuICAgICAgICB0aGlzQmFzaXMyLnguY2xvbmUoKSxcbiAgICAgICAgdGhpc0Jhc2lzMi55LmNsb25lKCksXG4gICAgICAgIHRoaXNCYXNpczIuei5jbG9uZSgpKTtcblxuICAgIGNvbnN0IHF1YXRlcm5pb24zMSA9IHJvdGF0aW9uQmFzaXMxLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgcXVhdGVybmlvbjMxUiA9IFF1YXRlcm5pb24uSW52ZXJzZShxdWF0ZXJuaW9uMzEpO1xuICAgIGNvbnN0IHF1YXRlcm5pb24zMiA9IHJvdGF0aW9uQmFzaXMyLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgcmV0dXJuIHF1YXRlcm5pb24zMi5tdWx0aXBseShxdWF0ZXJuaW9uMzFSKTtcbn1cblxuLypcbiAqIExlZnQgaGFuZGVkIGZvciBCSlMuXG4gKiBFYWNoIG9iamVjdCBpcyBkZWZpbmVkIGJ5IDMgcG9pbnRzLlxuICogQXNzdW1lIGEgaXMgb3JpZ2luLCBiIHBvaW50cyB0byAreCwgYWJjIGZvcm1zIFhZIHBsYW5lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFzaXMob2JqOiBWZWN0b3IzMyk6IEJhc2lzIHtcbiAgICBjb25zdCBbYSwgYiwgY10gPSBvYmo7XG4gICAgY29uc3QgcGxhbmVYWSA9IFBsYW5lLkZyb21Qb2ludHMoYSwgYiwgYykubm9ybWFsaXplKCk7XG4gICAgY29uc3QgYXhpc1ggPSBiLnN1YnRyYWN0KGEpLm5vcm1hbGl6ZSgpO1xuICAgIGNvbnN0IGF4aXNaID0gcGxhbmVYWS5ub3JtYWw7XG4gICAgLy8gUHJvamVjdCBjIG9udG8gYWJcbiAgICBjb25zdCBjcCA9IGEuYWRkKFxuICAgICAgICBheGlzWC5zY2FsZShWZWN0b3IzLkRvdChjLnN1YnRyYWN0KGEpLCBheGlzWCkgLyBWZWN0b3IzLkRvdChheGlzWCwgYXhpc1gpKVxuICAgICk7XG4gICAgY29uc3QgYXhpc1kgPSBjLnN1YnRyYWN0KGNwKS5ub3JtYWxpemUoKTtcbiAgICByZXR1cm4gbmV3IEJhc2lzKFtheGlzWCwgYXhpc1ksIGF4aXNaXSk7XG59XG5cbi8vIFByb2plY3QgcG9pbnRzIHRvIGFuIGF2ZXJhZ2UgcGxhbmVcbmV4cG9ydCBmdW5jdGlvbiBjYWxjQXZnUGxhbmUocHRzOiBWZWN0b3IzW10sIG5vcm1hbDogVmVjdG9yMyk6IFZlY3RvcjNbXSB7XG4gICAgaWYgKHB0cy5sZW5ndGggPT09IDApIHJldHVybiBbVmVjdG9yMy5aZXJvKCldO1xuICAgIGNvbnN0IGF2Z1B0ID0gcHRzLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgICByZXR1cm4gcHJldi5hZGQoY3Vycik7XG4gICAgfSkuc2NhbGUoMSAvIHB0cy5sZW5ndGgpO1xuXG4gICAgY29uc3QgcmV0ID0gcHRzLm1hcCgodikgPT4ge1xuICAgICAgICByZXR1cm4gdi5zdWJ0cmFjdChub3JtYWwuc2NhbGUoVmVjdG9yMy5Eb3Qobm9ybWFsLCB2LnN1YnRyYWN0KGF2Z1B0KSkpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjIgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgVmVjdG9yM30gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IEthbG1hbkZpbHRlciBmcm9tIFwia2FsbWFuanNcIjtcblxuZXhwb3J0IGNvbnN0IFZJU0lCSUxJVFlfVEhSRVNIT0xEOiBudW1iZXIgPSAwLjY7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyUGFyYW1zIHtcbiAgICBSPzogbnVtYmVyLFxuICAgIFE/OiBudW1iZXIsXG4gICAgb25lRXVyb0N1dG9mZj86IG51bWJlcixcbiAgICBvbmVFdXJvQmV0YT86IG51bWJlcixcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgZ2F1c3NpYW5TaWdtYT86IG51bWJlcixcbn1cblxuLy8gMUQgR2F1c3NpYW4gS2VybmVsXG5leHBvcnQgY29uc3QgZ2F1c3NpYW5LZXJuZWwxZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNxcjJwaSA9IE1hdGguc3FydCgyICogTWF0aC5QSSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZ2F1c3NpYW5LZXJuZWwxZCAoc2l6ZTogbnVtYmVyLCBzaWdtYTogbnVtYmVyKSB7XG4gICAgICAgIC8vIGVuc3VyZSBzaXplIGlzIGV2ZW4gYW5kIHByZXBhcmUgdmFyaWFibGVzXG4gICAgICAgIGxldCB3aWR0aCA9IChzaXplIC8gMikgfCAwLFxuICAgICAgICAgICAga2VybmVsID0gbmV3IEFycmF5KHdpZHRoICogMiArIDEpLFxuICAgICAgICAgICAgbm9ybSA9IDEuMCAvIChzcXIycGkgKiBzaWdtYSksXG4gICAgICAgICAgICBjb2VmZmljaWVudCA9IDIgKiBzaWdtYSAqIHNpZ21hLFxuICAgICAgICAgICAgdG90YWwgPSAwLFxuICAgICAgICAgICAgeDtcblxuICAgICAgICAvLyBzZXQgdmFsdWVzIGFuZCBpbmNyZW1lbnQgdG90YWxcbiAgICAgICAgZm9yICh4ID0gLXdpZHRoOyB4IDw9IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgIHRvdGFsICs9IGtlcm5lbFt3aWR0aCArIHhdID0gbm9ybSAqIE1hdGguZXhwKC14ICogeCAvIGNvZWZmaWNpZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRpdmlkZSBieSB0b3RhbCB0byBtYWtlIHN1cmUgdGhlIHN1bSBvZiBhbGwgdGhlIHZhbHVlcyBpcyBlcXVhbCB0byAxXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCBrZXJuZWwubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGtlcm5lbFt4XSAvPSB0b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXJuZWw7XG4gICAgfTtcbn0oKSk7XG5cbi8qXG4gKiBDb252ZXJ0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vamFhbnRvbGxhbmRlci9PbmVFdXJvRmlsdGVyLlxuICovXG5leHBvcnQgY2xhc3MgT25lRXVyb1ZlY3RvckZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyB0X3ByZXY6IG51bWJlcixcbiAgICAgICAgcHVibGljIHhfcHJldjogVmVjdG9yMyxcbiAgICAgICAgcHJpdmF0ZSBkeF9wcmV2ID0gVmVjdG9yMy5aZXJvKCksXG4gICAgICAgIHB1YmxpYyBtaW5fY3V0b2ZmID0gMS4wLFxuICAgICAgICBwdWJsaWMgYmV0YSA9IDAuMCxcbiAgICAgICAgcHVibGljIGRfY3V0b2ZmID0gMS4wXG4gICAgKSB7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc21vb3RoaW5nX2ZhY3Rvcih0X2U6IG51bWJlciwgY3V0b2ZmOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgciA9IDIgKiBNYXRoLlBJICogY3V0b2ZmICogdF9lO1xuICAgICAgICByZXR1cm4gciAvIChyICsgMSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZXhwb25lbnRpYWxfc21vb3RoaW5nKGE6IG51bWJlciwgeDogVmVjdG9yMywgeF9wcmV2OiBWZWN0b3IzKSB7XG4gICAgICAgIHJldHVybiB4LnNjYWxlKGEpLmFkZEluUGxhY2UoeF9wcmV2LnNjYWxlKCgxIC0gYSkpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmV4dCh0OiBudW1iZXIsIHg6IFZlY3RvcjMpIHtcbiAgICAgICAgY29uc3QgdF9lID0gdCAtIHRoaXMudF9wcmV2O1xuXG4gICAgICAgIC8vIFRoZSBmaWx0ZXJlZCBkZXJpdmF0aXZlIG9mIHRoZSBzaWduYWwuXG4gICAgICAgIGNvbnN0IGFfZCA9IE9uZUV1cm9WZWN0b3JGaWx0ZXIuc21vb3RoaW5nX2ZhY3Rvcih0X2UsIHRoaXMuZF9jdXRvZmYpO1xuICAgICAgICBjb25zdCBkeCA9IHguc3VidHJhY3QodGhpcy54X3ByZXYpLnNjYWxlSW5QbGFjZSgxIC8gdF9lKTtcbiAgICAgICAgY29uc3QgZHhfaGF0ID0gT25lRXVyb1ZlY3RvckZpbHRlci5leHBvbmVudGlhbF9zbW9vdGhpbmcoYV9kLCBkeCwgdGhpcy5keF9wcmV2KTtcblxuICAgICAgICAvLyBUaGUgZmlsdGVyZWQgc2lnbmFsLlxuICAgICAgICBjb25zdCBjdXRvZmYgPSB0aGlzLm1pbl9jdXRvZmYgKyB0aGlzLmJldGEgKiBkeF9oYXQubGVuZ3RoKCk7XG4gICAgICAgIGNvbnN0IGEgPSBPbmVFdXJvVmVjdG9yRmlsdGVyLnNtb290aGluZ19mYWN0b3IodF9lLCBjdXRvZmYpO1xuICAgICAgICBjb25zdCB4X2hhdCA9IE9uZUV1cm9WZWN0b3JGaWx0ZXIuZXhwb25lbnRpYWxfc21vb3RoaW5nKGEsIHgsIHRoaXMueF9wcmV2KTtcblxuICAgICAgICAvLyBNZW1vcml6ZSB0aGUgcHJldmlvdXMgdmFsdWVzLlxuICAgICAgICB0aGlzLnhfcHJldiA9IHhfaGF0O1xuICAgICAgICB0aGlzLmR4X3ByZXYgPSBkeF9oYXQ7XG4gICAgICAgIHRoaXMudF9wcmV2ID0gdDtcblxuICAgICAgICByZXR1cm4geF9oYXQ7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEthbG1hblZlY3RvckZpbHRlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBrYWxtYW5GaWx0ZXJYO1xuICAgIHByaXZhdGUgcmVhZG9ubHkga2FsbWFuRmlsdGVyWTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGthbG1hbkZpbHRlclo7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBSID0gMC4xLFxuICAgICAgICBwdWJsaWMgUSA9IDMsXG4gICAgKSB7XG4gICAgICAgIHRoaXMua2FsbWFuRmlsdGVyWCA9IG5ldyBLYWxtYW5GaWx0ZXIoe1E6IFEsIFI6IFJ9KTtcbiAgICAgICAgdGhpcy5rYWxtYW5GaWx0ZXJZID0gbmV3IEthbG1hbkZpbHRlcih7UTogUSwgUjogUn0pO1xuICAgICAgICB0aGlzLmthbG1hbkZpbHRlclogPSBuZXcgS2FsbWFuRmlsdGVyKHtROiBRLCBSOiBSfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5leHQodDogbnVtYmVyLCB2ZWM6IFZlY3RvcjMpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW1xuICAgICAgICAgICAgdGhpcy5rYWxtYW5GaWx0ZXJYLmZpbHRlcih2ZWMueCksXG4gICAgICAgICAgICB0aGlzLmthbG1hbkZpbHRlclkuZmlsdGVyKHZlYy55KSxcbiAgICAgICAgICAgIHRoaXMua2FsbWFuRmlsdGVyWi5maWx0ZXIodmVjLnopLFxuICAgICAgICBdXG5cbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuRnJvbUFycmF5KG5ld1ZhbHVlcyk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2F1c3NpYW5WZWN0b3JGaWx0ZXIge1xuICAgIHByaXZhdGUgX3ZhbHVlczogVmVjdG9yM1tdID0gW107XG4gICAgZ2V0IHZhbHVlcygpOiBWZWN0b3IzW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICAgIH1cbiAgICBwcml2YXRlIHJlYWRvbmx5IGtlcm5lbDogbnVtYmVyW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHNpemU6IG51bWJlcixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzaWdtYTogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGlmIChzaXplIDwgMikgdGhyb3cgUmFuZ2VFcnJvcihcIkZpbHRlciBzaXplIHRvbyBzaG9ydFwiKTtcbiAgICAgICAgdGhpcy5zaXplID0gTWF0aC5mbG9vcihzaXplKTtcbiAgICAgICAgdGhpcy5rZXJuZWwgPSBnYXVzc2lhbktlcm5lbDFkKHNpemUsIHNpZ21hKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVzaCh2OiBWZWN0b3IzKSB7XG4gICAgICAgIHRoaXMudmFsdWVzLnB1c2godik7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gdGhpcy5zaXplICsgMSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZXMuc2hpZnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPiB0aGlzLnNpemUgKyAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEludGVybmFsIHF1ZXVlIGhhcyBsZW5ndGggbG9uZ2VyIHRoYW4gc2l6ZTogJHt0aGlzLnNpemV9YCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5zbGljZSgtdGhpcy5zaXplKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXBwbHkoKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggIT09IHRoaXMuc2l6ZSkgcmV0dXJuIFZlY3RvcjMuWmVybygpO1xuICAgICAgICBjb25zdCByZXQgPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IHJldC5sZW5ndGgoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7ICsraSkge1xuICAgICAgICAgICAgcmV0LmFkZEluUGxhY2UodGhpcy52YWx1ZXNbaV0uc2NhbGUodGhpcy5rZXJuZWxbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW4xID0gcmV0Lmxlbmd0aCgpO1xuICAgICAgICAvLyBOb3JtYWxpemUgdG8gb3JpZ2luYWwgbGVuZ3RoXG4gICAgICAgIHJldC5zY2FsZUluUGxhY2UobGVuMCAvIGxlbjEpO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXVjbGlkZWFuSGlnaFBhc3NGaWx0ZXIge1xuICAgIHByaXZhdGUgX3ZhbHVlOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgZ2V0IHZhbHVlKCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdGhyZXNob2xkOiBudW1iZXJcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHY6IFZlY3RvcjMpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUuc3VidHJhY3QodikubGVuZ3RoKCkgPiB0aGlzLnRocmVzaG9sZCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IFZlY3RvcjMuWmVybygpO1xuICAgIH1cbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjIgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHtOb3JtYWxpemVkTGFuZG1hcmssIFJlc3VsdHN9IGZyb20gXCJAbWVkaWFwaXBlL2hvbGlzdGljXCI7XG5pbXBvcnQge051bGxhYmxlLCBWZWN0b3IzfSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5pbXBvcnQge1xuICAgIEZpbHRlclBhcmFtcyxcbiAgICBHYXVzc2lhblZlY3RvckZpbHRlcixcbiAgICBLYWxtYW5WZWN0b3JGaWx0ZXIsXG4gICAgT25lRXVyb1ZlY3RvckZpbHRlcixcbiAgICBWSVNJQklMSVRZX1RIUkVTSE9MRFxufSBmcm9tIFwiLi9maWx0ZXJcIjtcbmltcG9ydCB7b2JqZWN0RmxpcH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ige1xuICAgIHByaXZhdGUgbWFpbkZpbHRlcjogT25lRXVyb1ZlY3RvckZpbHRlciB8IEthbG1hblZlY3RvckZpbHRlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdhdXNzaWFuVmVjdG9yRmlsdGVyOiBOdWxsYWJsZTxHYXVzc2lhblZlY3RvckZpbHRlcj4gPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBfdCA9IDA7XG4gICAgZ2V0IHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Q7XG4gICAgfVxuXG4gICAgc2V0IHQodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcG9zID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgZ2V0IHBvcygpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdmlzaWJpbGl0eTogbnVtYmVyIHwgdW5kZWZpbmVkID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwYXJhbXM6IEZpbHRlclBhcmFtcyA9IHtcbiAgICAgICAgICAgIG9uZUV1cm9DdXRvZmY6IDAuMDEsXG4gICAgICAgICAgICBvbmVFdXJvQmV0YTogMCxcbiAgICAgICAgICAgIHR5cGU6ICdPbmVFdXJvJ1xuICAgICAgICB9XG4gICAgKSB7XG4gICAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gXCJLYWxtYW5cIilcbiAgICAgICAgICAgIHRoaXMubWFpbkZpbHRlciA9IG5ldyBLYWxtYW5WZWN0b3JGaWx0ZXIocGFyYW1zLlIsIHBhcmFtcy5RKTtcbiAgICAgICAgZWxzZSBpZiAocGFyYW1zLnR5cGUgPT09IFwiT25lRXVyb1wiKVxuICAgICAgICAgICAgdGhpcy5tYWluRmlsdGVyID0gbmV3IE9uZUV1cm9WZWN0b3JGaWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy50LFxuICAgICAgICAgICAgICAgIHRoaXMucG9zLFxuICAgICAgICAgICAgICAgIFZlY3RvcjMuWmVybygpLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5vbmVFdXJvQ3V0b2ZmLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5vbmVFdXJvQmV0YSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiV3JvbmcgZmlsdGVyIHR5cGUhXCIpO1xuICAgICAgICBpZiAocGFyYW1zLmdhdXNzaWFuU2lnbWEpXG4gICAgICAgICAgICB0aGlzLmdhdXNzaWFuVmVjdG9yRmlsdGVyID0gbmV3IEdhdXNzaWFuVmVjdG9yRmlsdGVyKDUsIHBhcmFtcy5nYXVzc2lhblNpZ21hKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlUG9zaXRpb24ocG9zOiBWZWN0b3IzLCB2aXNpYmlsaXR5PzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudCArPSAxO1xuXG4gICAgICAgIC8vIEZhY2UgTWVzaCBoYXMgbm8gdmlzaWJpbGl0eVxuICAgICAgICBpZiAodmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkIHx8IHZpc2liaWxpdHkgPiBWSVNJQklMSVRZX1RIUkVTSE9MRCkge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5tYWluRmlsdGVyLm5leHQodGhpcy50LCBwb3MpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5nYXVzc2lhblZlY3RvckZpbHRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIucHVzaChwb3MpO1xuICAgICAgICAgICAgICAgIHBvcyA9IHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIuYXBwbHkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcG9zID0gcG9zO1xuXG4gICAgICAgICAgICB0aGlzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JbXTtcblxuZXhwb3J0IHR5cGUgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjMgPSBbXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcixcbiAgICBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yLFxuICAgIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IsXG5dO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsb25lYWJsZVJlc3VsdHMgZXh0ZW5kcyBPbWl0PFJlc3VsdHMsICdzZWdtZW50YXRpb25NYXNrJyB8ICdpbWFnZSc+IHtcbn1cblxuZXhwb3J0IGNvbnN0IFBPU0VfTEFORE1BUktfTEVOR1RIID0gMzM7XG5leHBvcnQgY29uc3QgRkFDRV9MQU5ETUFSS19MRU5HVEggPSA0Nzg7XG5leHBvcnQgY29uc3QgSEFORF9MQU5ETUFSS19MRU5HVEggPSAyMTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yID0gKFxuICAgIGw6IE5vcm1hbGl6ZWRMYW5kbWFyayxcbiAgICBzY2FsaW5nID0gMS4sXG4gICAgcmV2ZXJzZVkgPSBmYWxzZSkgPT4ge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMyhcbiAgICAgICAgbC54ICogc2NhbGluZyxcbiAgICAgICAgcmV2ZXJzZVkgPyAtbC55ICogc2NhbGluZyA6IGwueSAqIHNjYWxpbmcsXG4gICAgICAgIGwueiAqIHNjYWxpbmcpO1xufVxuZXhwb3J0IGNvbnN0IHZlY3RvclRvTm9ybWFsaXplZExhbmRtYXJrID0gKGw6IFZlY3RvcjMpOiBOb3JtYWxpemVkTGFuZG1hcmsgPT4ge1xuICAgIHJldHVybiB7eDogbC54LCB5OiBsLnksIHo6IGwuen07XG59O1xuXG5leHBvcnQgY29uc3QgSEFORF9MQU5ETUFSS1MgPSB7XG4gICAgV1JJU1Q6IDAsXG4gICAgVEhVTUJfQ01DOiAxLFxuICAgIFRIVU1CX01DUDogMixcbiAgICBUSFVNQl9JUDogMyxcbiAgICBUSFVNQl9USVA6IDQsXG4gICAgSU5ERVhfRklOR0VSX01DUDogNSxcbiAgICBJTkRFWF9GSU5HRVJfUElQOiA2LFxuICAgIElOREVYX0ZJTkdFUl9ESVA6IDcsXG4gICAgSU5ERVhfRklOR0VSX1RJUDogOCxcbiAgICBNSURETEVfRklOR0VSX01DUDogOSxcbiAgICBNSURETEVfRklOR0VSX1BJUDogMTAsXG4gICAgTUlERExFX0ZJTkdFUl9ESVA6IDExLFxuICAgIE1JRERMRV9GSU5HRVJfVElQOiAxMixcbiAgICBSSU5HX0ZJTkdFUl9NQ1A6IDEzLFxuICAgIFJJTkdfRklOR0VSX1BJUDogMTQsXG4gICAgUklOR19GSU5HRVJfRElQOiAxNSxcbiAgICBSSU5HX0ZJTkdFUl9USVA6IDE2LFxuICAgIFBJTktZX01DUDogMTcsXG4gICAgUElOS1lfUElQOiAxOCxcbiAgICBQSU5LWV9ESVA6IDE5LFxuICAgIFBJTktZX1RJUDogMjAsXG59O1xuXG5leHBvcnQgY29uc3QgSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HID0ge1xuICAgIEhhbmQ6IEhBTkRfTEFORE1BUktTLldSSVNULFxuICAgIFRodW1iUHJveGltYWw6IEhBTkRfTEFORE1BUktTLlRIVU1CX0NNQyxcbiAgICBUaHVtYkludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuVEhVTUJfTUNQLFxuICAgIFRodW1iRGlzdGFsOiBIQU5EX0xBTkRNQVJLUy5USFVNQl9JUCxcbiAgICBJbmRleFByb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfTUNQLFxuICAgIEluZGV4SW50ZXJtZWRpYXRlOiBIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfUElQLFxuICAgIEluZGV4RGlzdGFsOiBIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfRElQLFxuICAgIE1pZGRsZVByb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5NSURETEVfRklOR0VSX01DUCxcbiAgICBNaWRkbGVJbnRlcm1lZGlhdGU6IEhBTkRfTEFORE1BUktTLk1JRERMRV9GSU5HRVJfUElQLFxuICAgIE1pZGRsZURpc3RhbDogSEFORF9MQU5ETUFSS1MuTUlERExFX0ZJTkdFUl9ESVAsXG4gICAgUmluZ1Byb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9NQ1AsXG4gICAgUmluZ0ludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuUklOR19GSU5HRVJfUElQLFxuICAgIFJpbmdEaXN0YWw6IEhBTkRfTEFORE1BUktTLlJJTkdfRklOR0VSX0RJUCxcbiAgICBMaXR0bGVQcm94aW1hbDogSEFORF9MQU5ETUFSS1MuUElOS1lfTUNQLFxuICAgIExpdHRsZUludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuUElOS1lfUElQLFxuICAgIExpdHRsZURpc3RhbDogSEFORF9MQU5ETUFSS1MuUElOS1lfRElQLFxufTtcbmV4cG9ydCBjb25zdCBIQU5EX0xBTkRNQVJLU19CT05FX1JFVkVSU0VfTUFQUElORzogeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfSA9IG9iamVjdEZsaXAoSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HKTtcbmV4cG9ydCB0eXBlIEhhbmRCb25lTWFwcGluZ0tleSA9IGtleW9mIHR5cGVvZiBIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkc7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGxhbmRtYXJrOiBudW1iZXIsIGlzTGVmdDogYm9vbGVhbikge1xuICAgIGlmICghKGxhbmRtYXJrIGluIEhBTkRfTEFORE1BUktTX0JPTkVfUkVWRVJTRV9NQVBQSU5HKSkgdGhyb3cgRXJyb3IoXCJXcm9uZyBsYW5kbWFyayBnaXZlbiFcIik7XG4gICAgcmV0dXJuIChpc0xlZnQgPyAnbGVmdCcgOiAncmlnaHQnKSArIEhBTkRfTEFORE1BUktTX0JPTkVfUkVWRVJTRV9NQVBQSU5HW2xhbmRtYXJrXTtcbn1cblxuLypcbiAqIERlcHRoLWZpcnN0IHNlYXJjaC93YWxrIG9mIGEgZ2VuZXJpYyB0cmVlLlxuICogQWxzbyByZXR1cm5zIGEgbWFwIGZvciBiYWNrdHJhY2tpbmcgZnJvbSBsZWFmLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwdGhGaXJzdFNlYXJjaChcbiAgICByb290Tm9kZTogYW55LFxuICAgIGY6IChuOiBhbnkpID0+IGJvb2xlYW5cbik6IFthbnksIGFueV0ge1xuICAgIGNvbnN0IHN0YWNrID0gW107XG4gICAgY29uc3QgcGFyZW50TWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcDxhbnksIGFueT4oKTtcbiAgICBzdGFjay5wdXNoKHJvb3ROb2RlKTtcblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggIT09IDApIHtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBmaXJzdCBjaGlsZCBpbiB0aGUgc3RhY2tcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGU6IGFueSA9IHN0YWNrLnNwbGljZSgtMSwgMSlbMF07XG4gICAgICAgIGNvbnN0IHJldFZhbCA9IGYoY3VycmVudE5vZGUpO1xuICAgICAgICBpZiAocmV0VmFsKSByZXR1cm4gW2N1cnJlbnROb2RlLCBwYXJlbnRNYXBdO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRDaGlsZHJlbiA9IGN1cnJlbnROb2RlLmNoaWxkcmVuO1xuICAgICAgICAvLyBhZGQgYW55IGNoaWxkcmVuIGluIHRoZSBub2RlIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrXG4gICAgICAgIGlmIChjdXJyZW50Q2hpbGRyZW4gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjdXJyZW50Q2hpbGRyZW4ubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjdXJyZW50Q2hpbGRyZW5baW5kZXhdO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmICghKHBhcmVudE1hcC5oYXMoY2hpbGQpKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRNYXAuc2V0KGNoaWxkLCBjdXJyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbbnVsbCwgbnVsbF07XG59XG4iLCIvKlxuQ29weXJpZ2h0IChDKSAyMDIyICBUaGUgdjNkIEF1dGhvcnMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIHZlcnNpb24gMy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7TnVsbGFibGUsIFF1YXRlcm5pb24sIEFuZ2xlLCBWZWN0b3IzLCBQbGFuZX0gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IHtyYW5nZUNhcH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7QmFzaXMsIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXN9IGZyb20gXCIuL2Jhc2lzXCI7XG5pbXBvcnQge3ZlY3RvclRvTm9ybWFsaXplZExhbmRtYXJrfSBmcm9tIFwiLi9sYW5kbWFya1wiO1xuaW1wb3J0IHtcbiAgICBGaWx0ZXJQYXJhbXMsXG4gICAgR2F1c3NpYW5WZWN0b3JGaWx0ZXIsXG4gICAgS2FsbWFuVmVjdG9yRmlsdGVyLFxufSBmcm9tIFwiLi9maWx0ZXJcIjtcblxuZXhwb3J0IGNsYXNzIENsb25lYWJsZVF1YXRlcm5pb25MaXRlIHtcbiAgICBwdWJsaWMgeDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgeTogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgejogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdzogbnVtYmVyID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBxOiBOdWxsYWJsZTxRdWF0ZXJuaW9uPixcbiAgICApIHtcbiAgICAgICAgaWYgKHEpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHEueDtcbiAgICAgICAgICAgIHRoaXMueSA9IHEueTtcbiAgICAgICAgICAgIHRoaXMueiA9IHEuejtcbiAgICAgICAgICAgIHRoaXMudyA9IHEudztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsb25lYWJsZVF1YXRlcm5pb24gZXh0ZW5kcyBDbG9uZWFibGVRdWF0ZXJuaW9uTGl0ZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFzZUJhc2lzOiBCYXNpcztcbiAgICBnZXQgYmFzZUJhc2lzKCk6IEJhc2lzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VCYXNpcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcTogTnVsbGFibGU8UXVhdGVybmlvbj4sXG4gICAgICAgIGJhc2lzPzogQmFzaXNcbiAgICApIHtcbiAgICAgICAgc3VwZXIocSk7XG4gICAgICAgIHRoaXMuX2Jhc2VCYXNpcyA9IGJhc2lzID8gYmFzaXMgOiBuZXcgQmFzaXMobnVsbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldChxOiBRdWF0ZXJuaW9uKSB7XG4gICAgICAgIHRoaXMueCA9IHEueDtcbiAgICAgICAgdGhpcy55ID0gcS55O1xuICAgICAgICB0aGlzLnogPSBxLno7XG4gICAgICAgIHRoaXMudyA9IHEudztcbiAgICB9XG5cbiAgICBwdWJsaWMgcm90YXRlQmFzaXMocTogUXVhdGVybmlvbik6IEJhc2lzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VCYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24ocSk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsb25lYWJsZVF1YXRlcm5pb25NYXAge1xuICAgIFtrZXk6IHN0cmluZ106IENsb25lYWJsZVF1YXRlcm5pb25cbn1cblxuZXhwb3J0IHR5cGUgQ2xvbmVhYmxlUXVhdGVybmlvbkxpc3QgPSBDbG9uZWFibGVRdWF0ZXJuaW9uW107XG5leHBvcnQgY29uc3QgY2xvbmVhYmxlUXVhdGVybmlvblRvUXVhdGVybmlvbiA9IChxOiBDbG9uZWFibGVRdWF0ZXJuaW9uTGl0ZSk6IFF1YXRlcm5pb24gPT4ge1xuICAgIGNvbnN0IHJldCA9IG5ldyBRdWF0ZXJuaW9uKHEueCwgcS55LCBxLnosIHEudyk7XG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJlZFF1YXRlcm5pb24ge1xuICAgIHByaXZhdGUgbWFpbkZpbHRlcjogS2FsbWFuVmVjdG9yRmlsdGVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2F1c3NpYW5WZWN0b3JGaWx0ZXI6IE51bGxhYmxlPEdhdXNzaWFuVmVjdG9yRmlsdGVyPiA9IG51bGw7XG5cbiAgICBwcml2YXRlIF90ID0gMDtcbiAgICBnZXQgdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdDtcbiAgICB9XG4gICAgc2V0IHQodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcm90ID0gUXVhdGVybmlvbi5JZGVudGl0eSgpO1xuICAgIGdldCByb3QoKTogUXVhdGVybmlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3Q7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHBhcmFtczogRmlsdGVyUGFyYW1zID0ge1xuICAgICAgICAgICAgUjogMSxcbiAgICAgICAgICAgIFE6IDEsXG4gICAgICAgICAgICB0eXBlOiAnS2FsbWFuJ1xuICAgICAgICB9XG4gICAgKSB7XG4gICAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gXCJLYWxtYW5cIilcbiAgICAgICAgICAgIHRoaXMubWFpbkZpbHRlciA9IG5ldyBLYWxtYW5WZWN0b3JGaWx0ZXIocGFyYW1zLlIsIHBhcmFtcy5RKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJXcm9uZyBmaWx0ZXIgdHlwZSFcIik7XG4gICAgICAgIGlmIChwYXJhbXMuZ2F1c3NpYW5TaWdtYSlcbiAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIgPSBuZXcgR2F1c3NpYW5WZWN0b3JGaWx0ZXIoNSwgcGFyYW1zLmdhdXNzaWFuU2lnbWEpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVSb3RhdGlvbihyb3Q6IFF1YXRlcm5pb24pIHtcbiAgICAgICAgdGhpcy50ICs9IDE7XG4gICAgICAgIGxldCBhbmdsZXMgPSByb3QudG9FdWxlckFuZ2xlcygpO1xuICAgICAgICBhbmdsZXMgPSB0aGlzLm1haW5GaWx0ZXIubmV4dCh0aGlzLnQsIGFuZ2xlcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIucHVzaChhbmdsZXMpO1xuICAgICAgICAgICAgYW5nbGVzID0gdGhpcy5nYXVzc2lhblZlY3RvckZpbHRlci5hcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcm90ID0gUXVhdGVybmlvbi5Gcm9tRXVsZXJWZWN0b3IoYW5nbGVzKTtcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIEZpbHRlcmVkUXVhdGVybmlvbkxpc3QgPSBGaWx0ZXJlZFF1YXRlcm5pb25bXTtcblxuXG5leHBvcnQgZW51bSBBWElTIHtcbiAgICB4LFxuICAgIHksXG4gICAgeixcbiAgICB4eSxcbiAgICB5eixcbiAgICB4eixcbiAgICB4eXosXG4gICAgbm9uZSA9IDEwXG59XG5cbi8vIENvbnZlbmllbmNlIGZ1bmN0aW9uc1xuZXhwb3J0IGNvbnN0IFJhZFRvRGVnID0gKHI6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiBBbmdsZS5Gcm9tUmFkaWFucyhyKS5kZWdyZWVzKCk7XG59XG5leHBvcnQgY29uc3QgRGVnVG9SYWQgPSAoZDogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIEFuZ2xlLkZyb21EZWdyZWVzKGQpLnJhZGlhbnMoKTtcbn1cblxuLyoqXG4gKiBDaGVjayBhIHF1YXRlcm5pb24gaXMgdmFsaWRcbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUXVhdGVybmlvbihxOiBRdWF0ZXJuaW9uKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShxLngpICYmIE51bWJlci5pc0Zpbml0ZShxLnkpICYmIE51bWJlci5pc0Zpbml0ZShxLnopICYmIE51bWJlci5pc0Zpbml0ZShxLncpO1xufVxuXG4vLyBTaW1pbGFyIHRvIHRocmVlLmpzIFF1YXRlcm5pb24uc2V0RnJvbVVuaXRWZWN0b3JzXG5leHBvcnQgY29uc3QgcXVhdGVybmlvbkJldHdlZW5WZWN0b3JzID0gKFxuICAgIHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyxcbik6IFF1YXRlcm5pb24gPT4ge1xuICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMy5HZXRBbmdsZUJldHdlZW5WZWN0b3JzKHYxLCB2MiwgVmVjdG9yMy5Dcm9zcyh2MSwgdjIpKVxuICAgIGNvbnN0IGF4aXMgPSBWZWN0b3IzLkNyb3NzKHYxLCB2Mik7XG4gICAgYXhpcy5ub3JtYWxpemUoKTtcbiAgICByZXR1cm4gUXVhdGVybmlvbi5Sb3RhdGlvbkF4aXMoYXhpcywgYW5nbGUpO1xufTtcbi8qKlxuICogU2FtZSBhcyBhYm92ZSwgRXVsZXIgYW5nbGUgdmVyc2lvblxuICogQHBhcmFtIHYxIElucHV0IHJvdGF0aW9uIGluIGRlZ3JlZXMgMVxuICogQHBhcmFtIHYyIElucHV0IHJvdGF0aW9uIGluIGRlZ3JlZXMgMlxuICogQHBhcmFtIHJlbWFwRGVncmVlIFdoZXRoZXIgcmUtbWFwIGRlZ3JlZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGRlZ3JlZUJldHdlZW5WZWN0b3JzID0gKFxuICAgIHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMywgcmVtYXBEZWdyZWUgPSBmYWxzZVxuKSA9PiB7XG4gICAgcmV0dXJuIHF1YXRlcm5pb25Ub0RlZ3JlZXMocXVhdGVybmlvbkJldHdlZW5WZWN0b3JzKHYxLCB2MiksIHJlbWFwRGVncmVlKTtcbn07XG4vKipcbiAqIFJlLW1hcCBkZWdyZWVzIHRvIC0xODAgdG8gMTgwXG4gKiBAcGFyYW0gZGVnIElucHV0IGFuZ2xlIGluIERlZ3JlZXNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbWFwRGVncmVlV2l0aENhcCA9IChkZWc6IG51bWJlcikgPT4ge1xuICAgIGRlZyA9IHJhbmdlQ2FwKGRlZywgMCwgMzYwKTtcbiAgICByZXR1cm4gZGVnIDwgMTgwID8gZGVnIDogZGVnIC0gMzYwO1xufVxuLyoqXG4gKiBDb252ZXJ0IHF1YXRlcm5pb25zIHRvIGRlZ3JlZXNcbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqIEBwYXJhbSByZW1hcERlZ3JlZSB3aGV0aGVyIHJlLW1hcCBkZWdyZWVzXG4gKi9cbmV4cG9ydCBjb25zdCBxdWF0ZXJuaW9uVG9EZWdyZWVzID0gKFxuICAgIHE6IFF1YXRlcm5pb24sXG4gICAgcmVtYXBEZWdyZWUgPSBmYWxzZSxcbikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHEudG9FdWxlckFuZ2xlcygpO1xuICAgIGNvbnN0IHJlbWFwRm4gPSByZW1hcERlZ3JlZSA/IHJlbWFwRGVncmVlV2l0aENhcCA6ICh4OiBudW1iZXIpID0+IHg7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKFxuICAgICAgICByZW1hcEZuKFJhZFRvRGVnKGFuZ2xlcy54KSksXG4gICAgICAgIHJlbWFwRm4oUmFkVG9EZWcoYW5nbGVzLnkpKSxcbiAgICAgICAgcmVtYXBGbihSYWRUb0RlZyhhbmdsZXMueikpLFxuICAgICk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdHdvIGRpcmVjdGlvbnMgYXJlIGNsb3NlIGVub3VnaCB3aXRoaW4gYSBzbWFsbCB2YWx1ZXNcbiAqIEBwYXJhbSB2MSBJbnB1dCBkaXJlY3Rpb24gMVxuICogQHBhcmFtIHYyIElucHV0IGRpcmVjdGlvbiAyXG4gKiBAcGFyYW0gZXBzIEVycm9yIHRocmVzaG9sZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmVjdG9yc1NhbWVEaXJXaXRoaW5FcHModjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzLCBlcHMgPSAxZS02KSB7XG4gICAgcmV0dXJuIHYxLmNyb3NzKHYyKS5sZW5ndGgoKSA8IGVwcyAmJiBWZWN0b3IzLkRvdCh2MSwgdjIpID4gMDtcbn1cblxuLyoqXG4gKiBUZXN0IHdoZXRoZXIgdHdvIHF1YXRlcm5pb25zIGhhdmUgZXF1YWwgZWZmZWN0c1xuICogQHBhcmFtIHExIElucHV0IHF1YXRlcm5pb24gMVxuICogQHBhcmFtIHEyIElucHV0IHF1YXRlcm5pb24gMlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGVzdFF1YXRlcm5pb25FcXVhbHNCeVZlY3RvcihxMTogUXVhdGVybmlvbiwgcTI6IFF1YXRlcm5pb24pIHtcbiAgICBjb25zdCB0ZXN0VmVjID0gVmVjdG9yMy5PbmUoKTtcbiAgICBjb25zdCB0ZXN0VmVjMSA9IFZlY3RvcjMuWmVybygpO1xuICAgIGNvbnN0IHRlc3RWZWMyID0gVmVjdG9yMy5PbmUoKTtcbiAgICB0ZXN0VmVjLnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKHExLCB0ZXN0VmVjMSk7XG4gICAgdGVzdFZlYy5yb3RhdGVCeVF1YXRlcm5pb25Ub1JlZihxMiwgdGVzdFZlYzIpO1xuICAgIHJldHVybiB2ZWN0b3JzU2FtZURpcldpdGhpbkVwcyh0ZXN0VmVjMSwgdGVzdFZlYzIpO1xufVxuXG4vKipcbiAqIFNhbWUgYXMgYWJvdmUsIEV1bGVyIGFuZ2xlIHZlcnNpb25cbiAqIEBwYXJhbSBkMSBJbnB1dCBkZWdyZWVzIDFcbiAqIEBwYXJhbSBkMiBJbnB1dCBkZWdyZWVzIDJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZ3JlZXNFcXVhbEluUXVhdGVybmlvbihcbiAgICBkMTogVmVjdG9yMywgZDI6IFZlY3RvcjNcbikge1xuICAgIGNvbnN0IHExID0gUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoRGVnVG9SYWQoZDEueCksIERlZ1RvUmFkKGQxLnkpLCBEZWdUb1JhZChkMS56KSk7XG4gICAgY29uc3QgcTIgPSBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcyhEZWdUb1JhZChkMi54KSwgRGVnVG9SYWQoZDIueSksIERlZ1RvUmFkKGQyLnopKTtcbiAgICByZXR1cm4gdGVzdFF1YXRlcm5pb25FcXVhbHNCeVZlY3RvcihxMSwgcTIpO1xufVxuXG4vKipcbiAqIFJldmVyc2Ugcm90YXRpb24gRXVsZXIgYW5nbGVzIG9uIGdpdmVuIGF4ZXNcbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqIEBwYXJhbSBheGlzIEF4ZXMgdG8gcmV2ZXJzZVxuICovXG5leHBvcnQgY29uc3QgcmV2ZXJzZVJvdGF0aW9uID0gKHE6IFF1YXRlcm5pb24sIGF4aXM6IEFYSVMpID0+IHtcbiAgICBpZiAoYXhpcyA9PT0gQVhJUy5ub25lKSByZXR1cm4gcTtcbiAgICBjb25zdCBhbmdsZXMgPSBxLnRvRXVsZXJBbmdsZXMoKTtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgICAgY2FzZSBBWElTLng6XG4gICAgICAgICAgICBhbmdsZXMueCA9IC1hbmdsZXMueDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gLWFuZ2xlcy55O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgYW5nbGVzLnogPSAtYW5nbGVzLno7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh5OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAtYW5nbGVzLng7XG4gICAgICAgICAgICBhbmdsZXMueSA9IC1hbmdsZXMueTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueXo6XG4gICAgICAgICAgICBhbmdsZXMueSA9IC1hbmdsZXMueTtcbiAgICAgICAgICAgIGFuZ2xlcy56ID0gLWFuZ2xlcy56O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54ejpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gLWFuZ2xlcy54O1xuICAgICAgICAgICAgYW5nbGVzLnogPSAtYW5nbGVzLno7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh5ejpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gLWFuZ2xlcy54O1xuICAgICAgICAgICAgYW5nbGVzLnkgPSAtYW5nbGVzLnk7XG4gICAgICAgICAgICBhbmdsZXMueiA9IC1hbmdsZXMuejtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGF4aXMhXCIpO1xuICAgIH1cbiAgICByZXR1cm4gUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbChhbmdsZXMueSwgYW5nbGVzLngsIGFuZ2xlcy56KTtcbn1cbi8qKlxuICogUmVtb3ZlIHJvdGF0aW9uIG9uIGdpdmVuIGF4ZXMuXG4gKiBPcHRpb25hbGx5IGNhcHBpbmcgcm90YXRpb24gKGluIEV1bGVyIGFuZ2xlcykgb24gdHdvIGF4ZXMuXG4gKiBUaGlzIG9wZXJhdGlvbiBhc3N1bWVzIHJlLW1hcHBlZCBkZWdyZWVzLlxuICogQHBhcmFtIHEgSW5wdXQgcXVhdGVybmlvblxuICogQHBhcmFtIGF4aXMgQXhlcyB0byByZW1vdmVcbiAqIEBwYXJhbSBjYXBBeGlzMSBDYXBwaW5nIGF4aXMgMVxuICogQHBhcmFtIGNhcExvdzEgQXhpcyAxIGxvd2VyIHJhbmdlXG4gKiBAcGFyYW0gY2FwSGlnaDEgQXhpcyAxIGhpZ2hlciByYW5nZVxuICogQHBhcmFtIGNhcEF4aXMyIENhcHBpbmcgYXhpcyAyXG4gKiBAcGFyYW0gY2FwTG93MiBBeGlzIDIgbG93ZXIgcmFuZ2VcbiAqIEBwYXJhbSBjYXBIaWdoMiBBeGlzIDIgaGlnaGVyIHJhbmdlXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwID0gKFxuICAgIHE6IFF1YXRlcm5pb24sXG4gICAgYXhpczogQVhJUyxcbiAgICBjYXBBeGlzMT86IEFYSVMsXG4gICAgY2FwTG93MT86IG51bWJlcixcbiAgICBjYXBIaWdoMT86IG51bWJlcixcbiAgICBjYXBBeGlzMj86IEFYSVMsXG4gICAgY2FwTG93Mj86IG51bWJlcixcbiAgICBjYXBIaWdoMj86IG51bWJlcixcbikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHF1YXRlcm5pb25Ub0RlZ3JlZXMocSwgdHJ1ZSk7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICAgIGNhc2UgQVhJUy5ub25lOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy55OlxuICAgICAgICAgICAgYW5nbGVzLnkgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgYW5nbGVzLnogPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54eTpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gMDtcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueXo6XG4gICAgICAgICAgICBhbmdsZXMueSA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh6OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAwO1xuICAgICAgICAgICAgYW5nbGVzLnogPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54eXo6XG4gICAgICAgICAgICBhbmdsZXMueCA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueSA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBheGlzIVwiKTtcbiAgICB9XG4gICAgaWYgKGNhcEF4aXMxICE9PSB1bmRlZmluZWQgJiYgY2FwTG93MSAhPT0gdW5kZWZpbmVkICYmIGNhcEhpZ2gxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3dpdGNoIChjYXBBeGlzMSBhcyBBWElTKSB7XG4gICAgICAgICAgICBjYXNlIEFYSVMueDpcbiAgICAgICAgICAgICAgICBhbmdsZXMueCA9IHJhbmdlQ2FwKGFuZ2xlcy54LCBjYXBMb3cxLCBjYXBIaWdoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgICAgICBhbmdsZXMueSA9IHJhbmdlQ2FwKGFuZ2xlcy55LCBjYXBMb3cxLCBjYXBIaWdoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMuejpcbiAgICAgICAgICAgICAgICBhbmdsZXMueiA9IHJhbmdlQ2FwKGFuZ2xlcy56LCBjYXBMb3cxLCBjYXBIaWdoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBjYXAgYXhpcyFcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNhcEF4aXMyICE9PSB1bmRlZmluZWQgJiYgY2FwTG93MiAhPT0gdW5kZWZpbmVkICYmIGNhcEhpZ2gyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3dpdGNoIChjYXBBeGlzMiBhcyBBWElTKSB7XG4gICAgICAgICAgICBjYXNlIEFYSVMueDpcbiAgICAgICAgICAgICAgICBhbmdsZXMueCA9IHJhbmdlQ2FwKGFuZ2xlcy54LCBjYXBMb3cyLCBjYXBIaWdoMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgICAgICBhbmdsZXMueSA9IHJhbmdlQ2FwKGFuZ2xlcy55LCBjYXBMb3cyLCBjYXBIaWdoMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMuejpcbiAgICAgICAgICAgICAgICBhbmdsZXMueiA9IHJhbmdlQ2FwKGFuZ2xlcy56LCBjYXBMb3cyLCBjYXBIaWdoMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBjYXAgYXhpcyFcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFF1YXRlcm5pb24uUm90YXRpb25ZYXdQaXRjaFJvbGwoXG4gICAgICAgIERlZ1RvUmFkKGFuZ2xlcy55KSxcbiAgICAgICAgRGVnVG9SYWQoYW5nbGVzLngpLFxuICAgICAgICBEZWdUb1JhZChhbmdsZXMueikpO1xufVxuLyoqXG4gKiBTd2l0Y2ggcm90YXRpb24gYXhlcy5cbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqIEBwYXJhbSBheGlzMSBBeGlzIDEgdG8gc3dpdGNoXG4gKiBAcGFyYW0gYXhpczIgQXhpcyAyIHRvIHN3aXRjaFxuICovXG5leHBvcnQgY29uc3QgZXhjaGFuZ2VSb3RhdGlvbkF4aXMgPSAoXG4gICAgcTogUXVhdGVybmlvbixcbiAgICBheGlzMTogQVhJUyxcbiAgICBheGlzMjogQVhJUyxcbikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlczogbnVtYmVyW10gPSBbXTtcbiAgICBxLnRvRXVsZXJBbmdsZXMoKS50b0FycmF5KGFuZ2xlcyk7XG4gICAgY29uc3QgYW5nbGUxID0gYW5nbGVzW2F4aXMxXTtcbiAgICBjb25zdCBhbmdsZTIgPSBhbmdsZXNbYXhpczJdO1xuICAgIGNvbnN0IHRlbXAgPSBhbmdsZTE7XG4gICAgYW5nbGVzW2F4aXMxXSA9IGFuZ2xlMjtcbiAgICBhbmdsZXNbYXhpczJdID0gdGVtcDtcbiAgICByZXR1cm4gUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoXG4gICAgICAgIGFuZ2xlc1swXSxcbiAgICAgICAgYW5nbGVzWzFdLFxuICAgICAgICBhbmdsZXNbMl0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJpbnRRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24sIHM/OiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhzLCB2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayhxdWF0ZXJuaW9uVG9EZWdyZWVzKHEsIHRydWUpKSk7XG59XG5cblxuLyoqXG4gKiBSZXN1bHQgaXMgaW4gUmFkaWFuIG9uIHVuaXQgc3BoZXJlIChyID0gMSkuXG4gKiBDYW5vbmljYWwgSVNPIDgwMDAwLTI6MjAxOSBjb252ZW50aW9uLlxuICogQHBhcmFtIHBvcyBFdWNsaWRlYW4gbG9jYWwgcG9zaXRpb25cbiAqIEBwYXJhbSBiYXNpcyBMb2NhbCBjb29yZGluYXRlIHN5c3RlbSBiYXNpc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY1NwaGVyaWNhbENvb3JkKFxuICAgIHBvczogVmVjdG9yMywgYmFzaXM6IEJhc2lzLFxuKSB7XG4gICAgY29uc3QgcVRvT3JpZ2luYWwgPSBRdWF0ZXJuaW9uLkludmVyc2UoUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgYmFzaXMueC5jbG9uZSgpLCBiYXNpcy55LmNsb25lKCksIGJhc2lzLnouY2xvbmUoKSkpLm5vcm1hbGl6ZSgpO1xuICAgIGNvbnN0IHBvc0luT3JpZ2luYWwgPSBWZWN0b3IzLlplcm8oKTtcbiAgICBwb3Mucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYocVRvT3JpZ2luYWwsIHBvc0luT3JpZ2luYWwpO1xuICAgIHBvc0luT3JpZ2luYWwubm9ybWFsaXplKCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhldGEgYW5kIHBoaVxuICAgIGNvbnN0IHggPSBwb3NJbk9yaWdpbmFsLng7XG4gICAgY29uc3QgeSA9IHBvc0luT3JpZ2luYWwueTtcbiAgICBjb25zdCB6ID0gcG9zSW5PcmlnaW5hbC56O1xuXG4gICAgY29uc3QgdGhldGEgPSBNYXRoLmFjb3Moeik7XG4gICAgY29uc3QgcGhpID0gTWF0aC5hdGFuMih5LCB4KTtcblxuICAgIHJldHVybiBbdGhldGEsIHBoaV07XG59XG5cbi8qKlxuICogQXNzdW1pbmcgcm90YXRpb24gc3RhcnRzIGZyb20gKDEsIDAsIDApIGluIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtLlxuICogQHBhcmFtIGJhc2lzIExvY2FsIGNvb3JkaW5hdGUgc3lzdGVtIGJhc2lzXG4gKiBAcGFyYW0gdGhldGEgUG9sYXIgYW5nbGVcbiAqIEBwYXJhbSBwaGkgQXppbXV0aGFsIGFuZ2xlXG4gKiBAcGFyYW0gcHJldlF1YXRlcm5pb24gUGFyZW50IHF1YXRlcm5pb24gdG8gdGhlIGxvY2FsIHN5c3RlbVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgIGJhc2lzOiBCYXNpcywgdGhldGE6IG51bWJlciwgcGhpOiBudW1iZXIsXG4gICAgcHJldlF1YXRlcm5pb246IFF1YXRlcm5pb24pIHtcbiAgICBjb25zdCB4VHogPSBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyhiYXNpcy55LmNsb25lKCksIC1NYXRoLlBJIC8gMik7XG4gICAgY29uc3QgeFR6QmFzaXMgPSBiYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24oeFR6KTtcbiAgICBjb25zdCBxMSA9IFF1YXRlcm5pb24uUm90YXRpb25BeGlzKHhUekJhc2lzLnguY2xvbmUoKSwgcGhpKTtcbiAgICBjb25zdCBxMUJhc2lzID0geFR6QmFzaXMucm90YXRlQnlRdWF0ZXJuaW9uKHExKTtcbiAgICBjb25zdCBxMiA9IFF1YXRlcm5pb24uUm90YXRpb25BeGlzKHExQmFzaXMueS5jbG9uZSgpLCB0aGV0YSk7XG4gICAgY29uc3QgcTJCYXNpcyA9IHExQmFzaXMucm90YXRlQnlRdWF0ZXJuaW9uKHEyKTtcblxuICAgIC8vIEZvcmNlIHJlc3VsdCB0byBmYWNlIGZyb250XG4gICAgY29uc3QgcGxhbmVYWiA9IFBsYW5lLkZyb21Qb3NpdGlvbkFuZE5vcm1hbChWZWN0b3IzLlplcm8oKSwgYmFzaXMueS5jbG9uZSgpKTtcbiAgICAvLyBjb25zdCBpbnRlcm1CYXNpcyA9IGJhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbih4VHoubXVsdGlwbHkocTEpLm11bHRpcGx5SW5QbGFjZShxMikpO1xuICAgIGNvbnN0IGludGVybUJhc2lzID0gcTJCYXNpcztcbiAgICBjb25zdCBuZXdCYXNpc1ogPSBWZWN0b3IzLkNyb3NzKGludGVybUJhc2lzLnguY2xvbmUoKSwgcGxhbmVYWi5ub3JtYWwpO1xuICAgIGNvbnN0IG5ld0Jhc2lzWSA9IFZlY3RvcjMuQ3Jvc3MobmV3QmFzaXNaLCBpbnRlcm1CYXNpcy54LmNsb25lKCkpO1xuICAgIGNvbnN0IG5ld0Jhc2lzID0gbmV3IEJhc2lzKFtpbnRlcm1CYXNpcy54LCBuZXdCYXNpc1ksIG5ld0Jhc2lzWl0pO1xuXG4gICAgcmV0dXJuIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoYmFzaXMsIG5ld0Jhc2lzLCBwcmV2UXVhdGVybmlvbik7XG59XG5cbi8vIFNjYWxlIHJvdGF0aW9uIGFuZ2xlcyBpbiBwbGFjZVxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlUm90YXRpb24ocXVhdGVybmlvbjogUXVhdGVybmlvbiwgc2NhbGU6IG51bWJlcikge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHF1YXRlcm5pb24udG9FdWxlckFuZ2xlcygpO1xuICAgIGFuZ2xlcy5zY2FsZUluUGxhY2Uoc2NhbGUpO1xuICAgIHJldHVybiBRdWF0ZXJuaW9uLkZyb21FdWxlclZlY3RvcihhbmdsZXMpO1xufVxuIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMSAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQge1BsYW5lLCBWZWN0b3IzLCBDdXJ2ZTMsIElMb2FkaW5nU2NyZWVufSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0QXJyYXk8VD4obGVuZ3RoOiBudW1iZXIsIGluaXRpYWxpemVyOiAoaTogbnVtYmVyKSA9PiBUKSB7XG4gICAgbGV0IGFyciA9IG5ldyBBcnJheTxUPihsZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspXG4gICAgICAgIGFycltpXSA9IGluaXRpYWxpemVyKGkpO1xuICAgIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgc3RlcDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgIHtsZW5ndGg6IE1hdGguY2VpbCgoZW5kIC0gc3RhcnQpIC8gc3RlcCl9LFxuICAgICAgICAoXywgaSkgPT4gc3RhcnQgKyBpICogc3RlcFxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5zcGFjZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZGl2OiBudW1iZXIpIHtcbiAgICBjb25zdCBzdGVwID0gKGVuZCAtIHN0YXJ0KSAvIGRpdjtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAge2xlbmd0aDogZGl2fSxcbiAgICAgICAgKF8sIGkpID0+IHN0YXJ0ICsgaSAqIHN0ZXBcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0RmxpcChvYmo6IGFueSkge1xuICAgIGNvbnN0IHJldDogYW55ID0ge307XG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKChrZXk6IGFueSkgPT4ge1xuICAgICAgICByZXRbb2JqW2tleV1dID0ga2V5O1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBjb25zdCByYW5nZUNhcCA9IChcbiAgICB2OiBudW1iZXIsXG4gICAgbWluOiBudW1iZXIsXG4gICAgbWF4OiBudW1iZXJcbikgPT4ge1xuICAgIGlmIChtaW4gPiBtYXgpIHtcbiAgICAgICAgY29uc3QgdG1wID0gbWF4O1xuICAgICAgICBtYXggPSBtaW47XG4gICAgICAgIG1pbiA9IHRtcDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIG1heCksIG1pbik7XG59XG5leHBvcnQgY29uc3QgcmVtYXBSYW5nZSA9IChcbiAgICB2OiBudW1iZXIsXG4gICAgc3JjX2xvdzogbnVtYmVyLFxuICAgIHNyY19oaWdoOiBudW1iZXIsXG4gICAgZHN0X2xvdzogbnVtYmVyLFxuICAgIGRzdF9oaWdoOiBudW1iZXJcbikgPT4ge1xuICAgIHJldHVybiBkc3RfbG93ICsgKHYgLSBzcmNfbG93KSAqIChkc3RfaGlnaCAtIGRzdF9sb3cpIC8gKHNyY19oaWdoIC0gc3JjX2xvdyk7XG59O1xuZXhwb3J0IGNvbnN0IHJlbWFwUmFuZ2VXaXRoQ2FwID0gKFxuICAgIHY6IG51bWJlcixcbiAgICBzcmNfbG93OiBudW1iZXIsXG4gICAgc3JjX2hpZ2g6IG51bWJlcixcbiAgICBkc3RfbG93OiBudW1iZXIsXG4gICAgZHN0X2hpZ2g6IG51bWJlclxuKSA9PiB7XG4gICAgY29uc3QgdjEgPSByYW5nZUNhcCh2LCBzcmNfbG93LCBzcmNfaGlnaCk7XG4gICAgcmV0dXJuIGRzdF9sb3cgKyAodjEgLSBzcmNfbG93KSAqIChkc3RfaGlnaCAtIGRzdF9sb3cpIC8gKHNyY19oaWdoIC0gc3JjX2xvdyk7XG59O1xuZXhwb3J0IGNvbnN0IHJlbWFwUmFuZ2VOb0NhcCA9IChcbiAgICB2OiBudW1iZXIsXG4gICAgc3JjX2xvdzogbnVtYmVyLFxuICAgIHNyY19oaWdoOiBudW1iZXIsXG4gICAgZHN0X2xvdzogbnVtYmVyLFxuICAgIGRzdF9oaWdoOiBudW1iZXJcbikgPT4ge1xuICAgIHJldHVybiBkc3RfbG93ICsgKHYgLSBzcmNfbG93KSAqIChkc3RfaGlnaCAtIGRzdF9sb3cpIC8gKHNyY19oaWdoIC0gc3JjX2xvdyk7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkVmVjdG9yMyh2OiBWZWN0b3IzKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh2LngpICYmIE51bWJlci5pc0Zpbml0ZSh2LnkpICYmIE51bWJlci5pc0Zpbml0ZSh2LnopO1xufVxuXG5leHBvcnQgdHlwZSBLZXlzTWF0Y2hpbmc8VCwgVj4gPSB7IFtLIGluIGtleW9mIFRdLT86IFRbS10gZXh0ZW5kcyBWID8gSyA6IG5ldmVyIH1ba2V5b2YgVF07XG5cbi8vIHR5cGUgTWV0aG9kS2V5c09mQSA9IEtleXNNYXRjaGluZzxBLCBGdW5jdGlvbj47XG5cbmV4cG9ydCB0eXBlIElmRXF1YWxzPFgsIFksIEEgPSBYLCBCID0gbmV2ZXI+ID1cbiAgICAoPFQ+KCkgPT4gVCBleHRlbmRzIFggPyAxIDogMikgZXh0ZW5kcyAoPFQ+KCkgPT4gVCBleHRlbmRzIFkgPyAxIDogMikgPyBBIDogQjtcbmV4cG9ydCB0eXBlIFJlYWRvbmx5S2V5czxUPiA9IHtcbiAgICBbUCBpbiBrZXlvZiBUXS0/OiBJZkVxdWFsczx7IFtRIGluIFBdOiBUW1BdIH0sIHsgLXJlYWRvbmx5IFtRIGluIFBdOiBUW1BdIH0sIG5ldmVyLCBQPlxufVtrZXlvZiBUXTtcblxuLy8gdHlwZSBSZWFkb25seUtleXNPZkEgPSBSZWFkb25seUtleXM8QT47XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRFcXVhbDxUPihhczogU2V0PFQ+LCBiczogU2V0PFQ+KSB7XG4gICAgaWYgKGFzLnNpemUgIT09IGJzLnNpemUpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXMpIGlmICghYnMuaGFzKGEpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0VmVjdG9yT25QbGFuZShwcm9qUGxhbmU6IFBsYW5lLCB2ZWM6IFZlY3RvcjMpIHtcbiAgICByZXR1cm4gdmVjLnN1YnRyYWN0KHByb2pQbGFuZS5ub3JtYWwuc2NhbGUoVmVjdG9yMy5Eb3QodmVjLCBwcm9qUGxhbmUubm9ybWFsKSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm91bmQodmFsdWU6IG51bWJlciwgcHJlY2lzaW9uOiBudW1iZXIpIHtcbiAgICBjb25zdCBtdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCAwKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIG11bHRpcGxpZXIpIC8gbXVsdGlwbGllcjtcbn1cblxuLyoqXG4gKiBTaW1wbGUgZml4ZWQgbGVuZ3RoIEZJRk8gcXVldWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBmaXhlZExlbmd0aFF1ZXVlPFQ+IHtcbiAgICBwcml2YXRlIF92YWx1ZXM6IFRbXSA9IFtdO1xuICAgIGdldCB2YWx1ZXMoKTogVFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgc2l6ZTogbnVtYmVyKSB7XG4gICAgfVxuXG4gICAgcHVibGljIHB1c2godjogVCkge1xuICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHYpO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPT09IHRoaXMuc2l6ZSArIDEpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnNoaWZ0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZXMubGVuZ3RoID4gdGhpcy5zaXplICsgMSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbnRlcm5hbCBxdWV1ZSBoYXMgbGVuZ3RoIGxvbmdlciB0aGFuIHNpemUgJHt0aGlzLnNpemV9OiBHb3QgbGVuZ3RoICR7dGhpcy52YWx1ZXMubGVuZ3RofWApO1xuICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gdGhpcy52YWx1ZXMuc2xpY2UoLXRoaXMuc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29uY2F0KGFycjogVFtdKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlcyA9IHRoaXMudmFsdWVzLmNvbmNhdChhcnIpO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPiB0aGlzLnNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IHRoaXMudmFsdWVzLnNsaWNlKC10aGlzLnNpemUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGZpcnN0KCkge1xuICAgICAgICBpZiAodGhpcy5fdmFsdWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbMF07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0KCkge1xuICAgICAgICBpZiAodGhpcy5fdmFsdWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzW3RoaXMuX3ZhbHVlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnZhbHVlcy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5sZW5ndGg7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFBvaW50KGN1cnZlOiBDdXJ2ZTMsIHg6IG51bWJlciwgZXBzID0gMC4wMDEpIHtcbiAgICBjb25zdCBwdHMgPSBjdXJ2ZS5nZXRQb2ludHMoKTtcbiAgICBpZiAoeCA+IHB0c1swXS54KSByZXR1cm4gcHRzWzBdLnk7XG4gICAgZWxzZSBpZiAoeCA8IHB0c1twdHMubGVuZ3RoIC0gMV0ueCkgcmV0dXJuIHB0c1twdHMubGVuZ3RoIC0gMV0ueTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHB0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoTWF0aC5hYnMoeCAtIHB0c1tpXS54KSA8IGVwcykgcmV0dXJuIHB0c1tpXS55O1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cblxuZXhwb3J0IGNvbnN0IExSID0gW1wibGVmdFwiLCBcInJpZ2h0XCJdO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tTG9hZGluZ1NjcmVlbiBpbXBsZW1lbnRzIElMb2FkaW5nU2NyZWVuIHtcbiAgICAvL29wdGlvbmFsLCBidXQgbmVlZGVkIGR1ZSB0byBpbnRlcmZhY2UgZGVmaW5pdGlvbnNcbiAgICBwdWJsaWMgbG9hZGluZ1VJQmFja2dyb3VuZENvbG9yOiBzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgbG9hZGluZ1VJVGV4dDogc3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJpbmdDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGxvYWRpbmdEaXY6IEhUTUxEaXZFbGVtZW50XG4gICAgKSB7fVxuXG4gICAgcHVibGljIGRpc3BsYXlMb2FkaW5nVUkoKSB7XG4gICAgICAgIGlmICghdGhpcy5sb2FkaW5nRGl2KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmxvYWRpbmdEaXYuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAvLyBEbyBub3QgYWRkIGEgbG9hZGluZyBzY3JlZW4gaWYgdGhlcmUgaXMgYWxyZWFkeSBvbmVcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJpbml0aWFsXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLl9yZXNpemVMb2FkaW5nVUkoKTtcbiAgICAgICAgLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fcmVzaXplTG9hZGluZ1VJKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZUxvYWRpbmdVSSgpIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZ0RpdilcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBfcmVzaXplTG9hZGluZ1VJID0gKCkgPT4ge1xuICAgIC8vICAgICBjb25zdCBjYW52YXNSZWN0ID0gdGhpcy5yZW5kZXJpbmdDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLy8gICAgIGNvbnN0IGNhbnZhc1Bvc2l0aW9uaW5nID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5yZW5kZXJpbmdDYW52YXMpLnBvc2l0aW9uO1xuICAgIC8vXG4gICAgLy8gICAgIGlmICghdGhpcy5fbG9hZGluZ0Rpdikge1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgdGhpcy5fbG9hZGluZ0Rpdi5zdHlsZS5wb3NpdGlvbiA9IChjYW52YXNQb3NpdGlvbmluZyA9PT0gXCJmaXhlZFwiKSA/IFwiZml4ZWRcIiA6IFwiYWJzb2x1dGVcIjtcbiAgICAvLyAgICAgdGhpcy5fbG9hZGluZ0Rpdi5zdHlsZS5sZWZ0ID0gY2FudmFzUmVjdC5sZWZ0ICsgXCJweFwiO1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLnRvcCA9IGNhbnZhc1JlY3QudG9wICsgXCJweFwiO1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLndpZHRoID0gY2FudmFzUmVjdC53aWR0aCArIFwicHhcIjtcbiAgICAvLyAgICAgdGhpcy5fbG9hZGluZ0Rpdi5zdHlsZS5oZWlnaHQgPSBjYW52YXNSZWN0LmhlaWdodCArIFwicHhcIjtcbiAgICAvLyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludExpbmVEaXN0YW5jZShcbiAgICBwb2ludDogVmVjdG9yMyxcbiAgICBsaW5lRW5kQTogVmVjdG9yMywgbGluZUVuZEI6IFZlY3RvcjNcbikge1xuICAgIGNvbnN0IGxpbmVEaXIgPSBsaW5lRW5kQi5zdWJ0cmFjdChsaW5lRW5kQSkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgcFByb2ogPSBsaW5lRW5kQS5hZGQoXG4gICAgICAgIGxpbmVEaXIuc2NhbGUoXG4gICAgICAgICAgICBWZWN0b3IzLkRvdChwb2ludC5zdWJ0cmFjdChsaW5lRW5kQSksIGxpbmVEaXIpXG4gICAgICAgICAgICAvIFZlY3RvcjMuRG90KGxpbmVEaXIsIGxpbmVEaXIpKSk7XG4gICAgcmV0dXJuIHBvaW50LnN1YnRyYWN0KHBQcm9qKS5sZW5ndGgoKTtcbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjEgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0ICogYXMgQ29tbGluayBmcm9tIFwiY29tbGlua1wiO1xuaW1wb3J0IHtcbiAgICBGQUNFTUVTSF9GQUNFX09WQUwsXG4gICAgRkFDRU1FU0hfTEVGVF9FWUUsXG4gICAgRkFDRU1FU0hfTEVGVF9FWUVCUk9XLFxuICAgIEZBQ0VNRVNIX0xFRlRfSVJJUyxcbiAgICBGQUNFTUVTSF9MSVBTLFxuICAgIEZBQ0VNRVNIX1JJR0hUX0VZRSxcbiAgICBGQUNFTUVTSF9SSUdIVF9FWUVCUk9XLFxuICAgIEZBQ0VNRVNIX1JJR0hUX0lSSVMsXG4gICAgTm9ybWFsaXplZExhbmRtYXJrLFxuICAgIE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QsXG4gICAgUE9TRV9MQU5ETUFSS1MsXG4gICAgUE9TRV9MQU5ETUFSS1NfTEVGVCxcbiAgICBQT1NFX0xBTkRNQVJLU19SSUdIVCxcbn0gZnJvbSBcIkBtZWRpYXBpcGUvaG9saXN0aWNcIjtcbmltcG9ydCB7IE51bGxhYmxlLCBQbGFuZSwgUXVhdGVybmlvbiwgVmVjdG9yMyB9IGZyb20gXCJAYmFieWxvbmpzL2NvcmVcIjtcbmltcG9ydCB7XG4gICAgZml4ZWRMZW5ndGhRdWV1ZSxcbiAgICBpbml0QXJyYXksXG4gICAgS2V5c01hdGNoaW5nLFxuICAgIExSLFxuICAgIHBvaW50TGluZURpc3RhbmNlLFxuICAgIHByb2plY3RWZWN0b3JPblBsYW5lLFxuICAgIFJlYWRvbmx5S2V5cyxcbiAgICByZW1hcFJhbmdlLFxuICAgIHJlbWFwUmFuZ2VOb0NhcCxcbiAgICByZW1hcFJhbmdlV2l0aENhcCxcbn0gZnJvbSBcIi4uL2hlbHBlci91dGlsc1wiO1xuaW1wb3J0IHsgVHJhbnNmb3JtTm9kZVRyZWVOb2RlIH0gZnJvbSBcInYzZC1jb3JlLXJlYWxiaXRzL2Rpc3Qvc3JjL2ltcG9ydGVyL2JhYnlsb24tdnJtLWxvYWRlci9zcmNcIjtcbmltcG9ydCB7XG4gICAgQ2xvbmVhYmxlUmVzdWx0cyxcbiAgICBkZXB0aEZpcnN0U2VhcmNoLFxuICAgIEZBQ0VfTEFORE1BUktfTEVOR1RILFxuICAgIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IsXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjMsXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QsXG4gICAgSEFORF9MQU5ETUFSS19MRU5HVEgsXG4gICAgSEFORF9MQU5ETUFSS1MsXG4gICAgSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HLFxuICAgIGhhbmRMYW5kTWFya1RvQm9uZU5hbWUsXG4gICAgbm9ybWFsaXplZExhbmRtYXJrVG9WZWN0b3IsXG4gICAgUE9TRV9MQU5ETUFSS19MRU5HVEgsXG4gICAgdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmssXG59IGZyb20gXCIuLi9oZWxwZXIvbGFuZG1hcmtcIjtcbmltcG9ydCB7XG4gICAgQVhJUyxcbiAgICBjYWxjU3BoZXJpY2FsQ29vcmQsXG4gICAgQ2xvbmVhYmxlUXVhdGVybmlvbixcbiAgICBDbG9uZWFibGVRdWF0ZXJuaW9uTWFwLFxuICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24sXG4gICAgZGVncmVlQmV0d2VlblZlY3RvcnMsXG4gICAgRmlsdGVyZWRRdWF0ZXJuaW9uLFxuICAgIHJlbW92ZVJvdGF0aW9uQXhpc1dpdGhDYXAsXG4gICAgcmV2ZXJzZVJvdGF0aW9uLFxuICAgIHNjYWxlUm90YXRpb24sXG4gICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uLFxufSBmcm9tIFwiLi4vaGVscGVyL3F1YXRlcm5pb25cIjtcbmltcG9ydCB7XG4gICAgQmFzaXMsXG4gICAgY2FsY0F2Z1BsYW5lLFxuICAgIGdldEJhc2lzLFxuICAgIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMsXG59IGZyb20gXCIuLi9oZWxwZXIvYmFzaXNcIjtcbmltcG9ydCB7IFZJU0lCSUxJVFlfVEhSRVNIT0xEIH0gZnJvbSBcIi4uL2hlbHBlci9maWx0ZXJcIjtcbmltcG9ydCB7IEJvbmVPcHRpb25zIH0gZnJvbSBcIi4uL3YzZC13ZWJcIjtcbmltcG9ydCB7IEh1bWFub2lkQm9uZSB9IGZyb20gXCJ2M2QtY29yZS1yZWFsYml0cy9kaXN0L3NyYy9pbXBvcnRlci9iYWJ5bG9uLXZybS1sb2FkZXIvc3JjL2h1bWFub2lkLWJvbmVcIjtcblxuZXhwb3J0IGNsYXNzIFBvc2VLZXlQb2ludHMge1xuICAgIHB1YmxpYyB0b3BfZmFjZV9vdmFsID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9mYWNlX292YWwgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBib3R0b21fZmFjZV9vdmFsID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZmFjZV9vdmFsID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfdG9wID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfYm90dG9tID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfaW5uZXIgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2V5ZV9vdXRlciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfZXllX2lubmVyX3NlY29uZGFyeSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfZXllX291dGVyX3NlY29uZGFyeSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfaXJpc190b3AgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2lyaXNfYm90dG9tID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9pcmlzX2xlZnQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2lyaXNfcmlnaHQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9leWVfdG9wID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZXllX2JvdHRvbSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9pbm5lciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9vdXRlciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9pbm5lcl9zZWNvbmRhcnkgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9leWVfb3V0ZXJfc2Vjb25kYXJ5ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfaXJpc190b3AgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9pcmlzX2JvdHRvbSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2lyaXNfbGVmdCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2lyaXNfcmlnaHQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF90b3BfZmlyc3QgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF90b3Bfc2Vjb25kID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfdG9wX3RoaXJkID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfYm90dG9tX2ZpcnN0ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfYm90dG9tX3NlY29uZCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX2JvdHRvbV90aGlyZCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX2xlZnQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF9yaWdodCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG59XG5cbmV4cG9ydCB0eXBlIFBvc2VzS2V5ID0ga2V5b2YgT21pdDxcbiAgICBQb3NlcyxcbiAgICBLZXlzTWF0Y2hpbmc8UG9zZXMsIEZ1bmN0aW9uPiB8IFJlYWRvbmx5S2V5czxQb3Nlcz5cbj47XG5cbmV4cG9ydCBjbGFzcyBQb3NlcyB7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBGQUNFX01FU0hfQ09OTkVDVElPTlMgPSBbXG4gICAgICAgIEZBQ0VNRVNIX0xFRlRfRVlFQlJPVyxcbiAgICAgICAgRkFDRU1FU0hfUklHSFRfRVlFQlJPVyxcbiAgICAgICAgRkFDRU1FU0hfTEVGVF9FWUUsXG4gICAgICAgIEZBQ0VNRVNIX1JJR0hUX0VZRSxcbiAgICAgICAgRkFDRU1FU0hfTEVGVF9JUklTLFxuICAgICAgICBGQUNFTUVTSF9SSUdIVF9JUklTLFxuICAgICAgICBGQUNFTUVTSF9MSVBTLFxuICAgICAgICBGQUNFTUVTSF9GQUNFX09WQUwsXG4gICAgXTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEhBTkRfQkFTRV9ST09UX05PUk1BTCA9IG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEhBTkRfUE9TSVRJT05fU0NBTElORyA9IDAuODtcblxuICAgIC8qIFJlbWFwIG9mZnNldHMgdG8gcXVhdGVybmlvbnMgdXNpbmcgYXJiaXRyYXJ5IHJhbmdlLlxuICAgICAqIElSSVNfTVA9TWVkaWFQaXBlIElyaXNcbiAgICAgKiBJUklTX0JKUz1CYWJ5bG9uSlMgUm90YXRpb25ZYXdQaXRjaFJvbGxcbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX01QX1hfUkFOR0UgPSAwLjAyNztcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX01QX1lfUkFOR0UgPSAwLjAxMTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX0JKU19YX1JBTkdFID0gMC4yODtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX0JKU19ZX1JBTkdFID0gMC4xMjtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEJMSU5LX1JBVElPX0xPVyA9IDAuNTk7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQkxJTktfUkFUSU9fSElHSCA9IDAuNjE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTU9VVEhfTVBfUkFOR0VfTE9XID0gMC4wMDE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTU9VVEhfTVBfUkFOR0VfSElHSCA9IDAuMDY7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBFWUVfV0lEVEhfQkFTRUxJTkUgPSAwLjA1NDY7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTU9VVEhfV0lEVEhfQkFTRUxJTkUgPSAwLjA5NTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBMUl9GQUNFX0RJUkVDVElPTl9SQU5HRSA9IDI3O1xuXG4gICAgLy8gR2VuZXJhbFxuICAgIHByaXZhdGUgX2JvbmVPcHRpb25zOiBCb25lT3B0aW9ucztcbiAgICAvLyBXb3JrYXJvdW5kIGZvciBQcm9taXNlIHByb2JsZW1cbiAgICBwdWJsaWMgdXBkYXRlQm9uZU9wdGlvbnModmFsdWU6IEJvbmVPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2JvbmVPcHRpb25zID0gdmFsdWU7XG4gICAgfVxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JvbmVSb3RhdGlvblVwZGF0ZUZuOiBOdWxsYWJsZTxcbiAgICAgICAgKChkYXRhOiBVaW50OEFycmF5KSA9PiB2b2lkKSAmIENvbWxpbmsuUHJveHlNYXJrZWRcbiAgICA+ID0gbnVsbDtcblxuICAgIC8vIFZSTU1hbmFnZXJcbiAgICBwcml2YXRlIGJvbmVzSGllcmFyY2h5VHJlZTogTnVsbGFibGU8VHJhbnNmb3JtTm9kZVRyZWVOb2RlPiA9IG51bGw7XG5cbiAgICAvLyBSZXN1bHRzXG4gICAgcHVibGljIGNsb25lYWJsZUlucHV0UmVzdWx0czogTnVsbGFibGU8Q2xvbmVhYmxlUmVzdWx0cz4gPSBudWxsO1xuXG4gICAgLy8gUG9zZSBMYW5kbWFya3NcbiAgICBwdWJsaWMgaW5wdXRQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oUE9TRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSBwb3NlTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihQT1NFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICBSOiAwLjEsXG4gICAgICAgICAgICAgICAgUTogNSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgd29ybGRQb3NlTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihQT1NFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAvLyBSOiAwLjEsIFE6IDAuMSwgdHlwZTogJ0thbG1hbicsXG4gICAgICAgICAgICAgICAgUjogMC4xLFxuICAgICAgICAgICAgICAgIFE6IDEsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgICAgIH0pOyAvLyAwLjAxLCAwLjYsIDAuMDA3XG4gICAgICAgIH0pO1xuICAgIC8vIENhbm5vdCB1c2UgVmVjdG9yMyBkaXJlY3RseSBzaW5jZSBwb3N0TWVzc2FnZSgpIGVyYXNlcyBhbGwgbWV0aG9kc1xuICAgIHB1YmxpYyBjbG9uZWFibGVQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oUE9TRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBGYWNlIE1lc2ggTGFuZG1hcmtzXG4gICAgcHVibGljIGlucHV0RmFjZUxhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEZBQ0VfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgZmFjZUxhbmRtYXJrczogRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QgPVxuICAgICAgICBpbml0QXJyYXk8RmlsdGVyZWRMYW5kbWFya1ZlY3Rvcj4oRkFDRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgICAgICAgICAgLy8gb25lRXVyb0N1dG9mZjogMC4wMSwgb25lRXVyb0JldGE6IDE1LCB0eXBlOiAnT25lRXVybycsXG4gICAgICAgICAgICAgICAgUjogMC4xLFxuICAgICAgICAgICAgICAgIFE6IDEsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgICAgIH0pOyAvLyAwLjAxLCAxNSwgMC4wMDJcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSBfZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdDogbnVtYmVyW11bXSA9IFtdO1xuICAgIGdldCBmYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0KCk6IG51bWJlcltdW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9mYWNlTWVzaExhbmRtYXJrTGlzdDogTm9ybWFsaXplZExhbmRtYXJrTGlzdFtdID0gW107XG4gICAgZ2V0IGZhY2VNZXNoTGFuZG1hcmtMaXN0KCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3RbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mYWNlTWVzaExhbmRtYXJrTGlzdDtcbiAgICB9XG5cbiAgICAvLyBMZWZ0IEhhbmQgTGFuZG1hcmtzXG4gICAgcHJpdmF0ZSBsZWZ0V3Jpc3RPZmZzZXQ6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IgPVxuICAgICAgICBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgICAgICBSOiAwLjEsXG4gICAgICAgICAgICBROiAyLFxuICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgfSk7IC8vIDAuMDEsIDIsIDAuMDA4XG4gICAgcHVibGljIGlucHV0TGVmdEhhbmRMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIGxlZnRIYW5kTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICBSOiAxLFxuICAgICAgICAgICAgICAgIFE6IDEwLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiS2FsbWFuXCIsXG4gICAgICAgICAgICB9KTsgLy8gMC4wMDEsIDAuNlxuICAgICAgICB9KTtcbiAgICBwdWJsaWMgY2xvbmVhYmxlTGVmdEhhbmRMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIGxlZnRIYW5kTm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG5cbiAgICAvLyBSaWdodCBIYW5kIExhbmRtYXJrc1xuICAgIHByaXZhdGUgcmlnaHRXcmlzdE9mZnNldDogRmlsdGVyZWRMYW5kbWFya1ZlY3RvciA9XG4gICAgICAgIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgIFI6IDAuMSxcbiAgICAgICAgICAgIFE6IDIsXG4gICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICB9KTsgLy8gMC4wMSwgMiwgMC4wMDhcbiAgICBwdWJsaWMgaW5wdXRSaWdodEhhbmRMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIHJpZ2h0SGFuZExhbmRtYXJrczogRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QgPVxuICAgICAgICBpbml0QXJyYXk8RmlsdGVyZWRMYW5kbWFya1ZlY3Rvcj4oSEFORF9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgICAgICAgICAgUjogMSxcbiAgICAgICAgICAgICAgICBROiAxMCxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICAgICAgfSk7IC8vIDAuMDAxLCAwLjZcbiAgICAgICAgfSk7XG4gICAgcHVibGljIGNsb25lYWJsZVJpZ2h0SGFuZExhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEhBTkRfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgcmlnaHRIYW5kTm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG5cbiAgICAvLyBGZWV0XG4gICAgcHJpdmF0ZSBsZWZ0Rm9vdE5vcm1hbDogVmVjdG9yMyA9IFZlY3RvcjMuWmVybygpO1xuICAgIHByaXZhdGUgcmlnaHRGb290Tm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgcHJpdmF0ZSBsZWZ0Rm9vdEJhc2lzUm90YXRpb246IFF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLklkZW50aXR5KCk7XG4gICAgcHJpdmF0ZSByaWdodEZvb3RCYXNpc1JvdGF0aW9uOiBRdWF0ZXJuaW9uID0gUXVhdGVybmlvbi5JZGVudGl0eSgpO1xuXG4gICAgLy8gS2V5IHBvaW50c1xuICAgIHByaXZhdGUgX2tleVBvaW50czogUG9zZUtleVBvaW50cyA9IG5ldyBQb3NlS2V5UG9pbnRzKCk7XG4gICAgZ2V0IGtleVBvaW50cygpOiBQb3NlS2V5UG9pbnRzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleVBvaW50cztcbiAgICB9XG4gICAgcHJpdmF0ZSBfYmxpbmtCYXNlOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICBSOiAxLFxuICAgICAgICBROiAxLFxuICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgIH0pO1xuICAgIHByaXZhdGUgX2xlZnRCbGlua0FycjogZml4ZWRMZW5ndGhRdWV1ZTxudW1iZXI+ID1cbiAgICAgICAgbmV3IGZpeGVkTGVuZ3RoUXVldWU8bnVtYmVyPigxMCk7XG4gICAgcHJpdmF0ZSBfcmlnaHRCbGlua0FycjogZml4ZWRMZW5ndGhRdWV1ZTxudW1iZXI+ID1cbiAgICAgICAgbmV3IGZpeGVkTGVuZ3RoUXVldWU8bnVtYmVyPigxMCk7XG5cbiAgICAvLyBDYWxjdWxhdGVkIHByb3BlcnRpZXNcbiAgICBwcml2YXRlIF9mYWNlTm9ybWFsOiBOb3JtYWxpemVkTGFuZG1hcmsgPSB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICBnZXQgZmFjZU5vcm1hbCgpOiBOb3JtYWxpemVkTGFuZG1hcmsge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmFjZU5vcm1hbDtcbiAgICB9XG4gICAgcHJpdmF0ZSBfaGVhZFF1YXRlcm5pb246IEZpbHRlcmVkUXVhdGVybmlvbiA9IG5ldyBGaWx0ZXJlZFF1YXRlcm5pb24oe1xuICAgICAgICBSOiAxLFxuICAgICAgICBROiA1MCxcbiAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICB9KTtcblxuICAgIC8vIFRPRE86IG9wdGlvbjogbG9jayB4IHJvdGF0aW9uXG5cbiAgICAvLyBBIGNvcHkgZm9yIHJlc3RvcmUgYm9uZSBsb2NhdGlvbnNcbiAgICBwcml2YXRlIF9pbml0Qm9uZVJvdGF0aW9uczogQ2xvbmVhYmxlUXVhdGVybmlvbk1hcCA9IHt9O1xuICAgIC8vIENhbGN1bGF0ZWQgYm9uZSByb3RhdGlvbnNcbiAgICBwcml2YXRlIF9ib25lUm90YXRpb25zOiBDbG9uZWFibGVRdWF0ZXJuaW9uTWFwID0ge307XG4gICAgcHJpdmF0ZSB0ZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG4gICAgcHJpdmF0ZSBfbGVmdEhhbmROb3JtYWxzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oMywgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBnZXQgbGVmdEhhbmROb3JtYWxzKCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdEhhbmROb3JtYWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JpZ2h0SGFuZE5vcm1hbHM6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPigzLCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIGdldCByaWdodEhhbmROb3JtYWxzKCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRIYW5kTm9ybWFscztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wb3NlTm9ybWFsczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KFxuICAgICAgICAgICAgMywgLy8gQXJiaXRyYXJ5IGxlbmd0aCBmb3IgZGVidWdnaW5nXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIGdldCBwb3NlTm9ybWFscygpOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2VOb3JtYWxzO1xuICAgIH1cblxuICAgIHB1YmxpYyBtaWRIaXBQb3M6IE51bGxhYmxlPE5vcm1hbGl6ZWRMYW5kbWFyaz4gPSBudWxsO1xuICAgIHB1YmxpYyBtaWRIaXBJbml0T2Zmc2V0OiBOdWxsYWJsZTxOb3JtYWxpemVkTGFuZG1hcms+ID0gbnVsbDtcbiAgICBwdWJsaWMgbWlkSGlwT2Zmc2V0ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICBSOiAxLFxuICAgICAgICBROiAxMCxcbiAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBib25lT3B0aW9uczogQm9uZU9wdGlvbnMsXG4gICAgICAgIGJvbmVSb3RhdGlvblVwZGF0ZUZuPzogKChkYXRhOiBVaW50OEFycmF5KSA9PiB2b2lkKSAmXG4gICAgICAgICAgICBDb21saW5rLlByb3h5TWFya2VkXG4gICAgKSB7XG4gICAgICAgIHRoaXMuaW5pdEJvbmVSb3RhdGlvbnMoKTsgLy9wcm92aXNpb25hbFxuICAgICAgICB0aGlzLl9ib25lT3B0aW9ucyA9IGJvbmVPcHRpb25zO1xuICAgICAgICBpZiAoYm9uZVJvdGF0aW9uVXBkYXRlRm4pXG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25VcGRhdGVGbiA9IGJvbmVSb3RhdGlvblVwZGF0ZUZuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uZSB0aW1lIG9wZXJhdGlvbiB0byBzZXQgYm9uZXMgaGllcmFyY2h5IGZyb20gVlJNTWFuYWdlclxuICAgICAqIEBwYXJhbSB0cmVlIHJvb3Qgbm9kZSBvZiB0cmVlXG4gICAgICovXG4gICAgcHVibGljIHNldEJvbmVzSGllcmFyY2h5VHJlZShcbiAgICAgICAgdHJlZTogVHJhbnNmb3JtTm9kZVRyZWVOb2RlLFxuICAgICAgICBmb3JjZVJlcGxhY2UgPSBmYWxzZVxuICAgICkge1xuICAgICAgICAvLyBBc3N1bWUgYm9uZXMgaGF2ZSB1bmlxdWUgbmFtZXNcbiAgICAgICAgaWYgKHRoaXMuYm9uZXNIaWVyYXJjaHlUcmVlICYmICFmb3JjZVJlcGxhY2UpIHJldHVybjtcblxuICAgICAgICB0aGlzLmJvbmVzSGllcmFyY2h5VHJlZSA9IHRyZWU7XG5cbiAgICAgICAgLy8gUmUtaW5pdCBib25lIHJvdGF0aW9uc1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9ucyA9IHt9O1xuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKFxuICAgICAgICAgICAgdGhpcy5ib25lc0hpZXJhcmNoeVRyZWUsXG4gICAgICAgICAgICAobjogVHJhbnNmb3JtTm9kZVRyZWVOb2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbbi5uYW1lXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5pbml0Qm9uZVJvdGF0aW9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbCBNZWRpYVBpcGUgaW5wdXRzIGhhdmUgdGhlIGZvbGxvd2luZyBjb252ZW50aW9uczpcbiAgICAgKiAgLSBMZWZ0LXJpZ2h0IG1pcnJvcmVkIChzZWxmaWUgbW9kZSlcbiAgICAgKiAgLSBGYWNlIHRvd2FyZHMgLVogKHRvd2FyZHMgY2FtZXJhKSBieSBkZWZhdWx0XG4gICAgICogIFRPRE86IGludGVycG9sYXRlIHJlc3VsdHMgdG8gNjAgRlBTLlxuICAgICAqIEBwYXJhbSByZXN1bHRzIFJlc3VsdCBvYmplY3QgZnJvbSBNZWRpYVBpcGUgSG9saXN0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJvY2VzcyhyZXN1bHRzOiBDbG9uZWFibGVSZXN1bHRzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2FsbCBwcm9jZXNzKClcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzdWx0czogXCIsIHJlc3VsdHMpO1xuXG4gICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzID0gcmVzdWx0cztcbiAgICAgICAgaWYgKCF0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cykgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5yZXNldEludmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldEJvbmVSb3RhdGlvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJlUHJvY2Vzc1Jlc3VsdHMoKTtcblxuICAgICAgICAvLyBBY3R1YWwgcHJvY2Vzc2luZ1xuICAgICAgICAvLyBQb3N0IGZpbHRlcmVkIGxhbmRtYXJrc1xuICAgICAgICB0aGlzLnRvQ2xvbmVhYmxlTGFuZG1hcmtzKFxuICAgICAgICAgICAgdGhpcy5wb3NlTGFuZG1hcmtzLFxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVQb3NlTGFuZG1hcmtzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZmlsdGVyRmFjZUxhbmRtYXJrcygpO1xuICAgICAgICB0aGlzLnRvQ2xvbmVhYmxlTGFuZG1hcmtzKFxuICAgICAgICAgICAgdGhpcy5sZWZ0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlTGVmdEhhbmRMYW5kbWFya3NcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy50b0Nsb25lYWJsZUxhbmRtYXJrcyhcbiAgICAgICAgICAgIHRoaXMucmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVSaWdodEhhbmRMYW5kbWFya3NcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBHYXRoZXIga2V5IHBvaW50c1xuICAgICAgICB0aGlzLmdldEtleVBvaW50cygpO1xuXG4gICAgICAgIC8vIEJvbmUgT3JpZW50YXRpb25zIEluZGVwZW5kZW50XG4gICAgICAgIC8vIENhbGN1bGF0ZSBpcmlzIG9yaWVudGF0aW9uc1xuICAgICAgICB0aGlzLmNhbGNJcmlzTm9ybWFsKCk7XG5cbiAgICAgICAgLy8gQm9uZSBPcmllbnRhdGlvbnMgRGVwZW5kZW50XG4gICAgICAgIC8vIENhbGN1bGF0ZSBmYWNlIG9yaWVudGF0aW9uXG4gICAgICAgIHRoaXMuY2FsY0ZhY2VCb25lcygpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBleHByZXNzaW9uc1xuICAgICAgICB0aGlzLmNhbGNFeHByZXNzaW9ucygpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBmdWxsIGJvZHkgYm9uZXNcbiAgICAgICAgdGhpcy5jYWxjUG9zZUJvbmVzKCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGhhbmQgYm9uZXNcbiAgICAgICAgdGhpcy5jYWxjSGFuZEJvbmVzKCk7XG5cbiAgICAgICAgLy8gUG9zdCBwcm9jZXNzaW5nXG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5pcmlzTG9ja1gpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJpcmlzXCJdLnNldChcbiAgICAgICAgICAgICAgICByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImlyaXNcIl1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy54XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJsZWZ0SXJpc1wiXS5zZXQoXG4gICAgICAgICAgICAgICAgcmVtb3ZlUm90YXRpb25BeGlzV2l0aENhcChcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVhYmxlUXVhdGVybmlvblRvUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJpcmlzXCJdXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wicmlnaHRJcmlzXCJdLnNldChcbiAgICAgICAgICAgICAgICByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImlyaXNcIl1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy54XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvY2tCb25lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgLy8gSG9saXN0aWMgZG9lc24ndCByZXNldCBoYW5kIGxhbmRtYXJrcyB3aGVuIGludmlzaWJsZVxuICAgICAgICAvLyBTbyB3ZSBpbmZlciBpbnZpc2liaWxpdHkgZnJvbSB3cmlzdCBsYW5kbWFya1xuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMucmVzZXRJbnZpc2libGUpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAodGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTLkxFRlRfV1JJU1RcbiAgICAgICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMCkgPCBWSVNJQklMSVRZX1RIUkVTSE9MRFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKEhBTkRfTEFORE1BUktTX0JPTkVfTUFQUElORykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYGxlZnQke2t9YDtcbiAgICAgICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLUy5SSUdIVF9XUklTVFxuICAgICAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwKSA8IFZJU0lCSUxJVFlfVEhSRVNIT0xEXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgcmlnaHQke2t9YDtcbiAgICAgICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2JvbmVPcHRpb25zLmxvY2tGaW5nZXIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZCBvZiBMUikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGQgKyBrO1xuICAgICAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMubG9ja0FybSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIExSKSB7XG4gICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goYCR7a31VcHBlckFybWApO1xuICAgICAgICAgICAgICAgIGxvY2tCb25lcy5wdXNoKGAke2t9TG93ZXJBcm1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMubG9ja0xlZykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIExSKSB7XG4gICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goYCR7a31VcHBlckxlZ2ApO1xuICAgICAgICAgICAgICAgIGxvY2tCb25lcy5wdXNoKGAke2t9TG93ZXJMZWdgKTtcbiAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChgJHtrfUZvb3RgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbHRlckJvbmVSb3RhdGlvbnMobG9ja0JvbmVzKTtcblxuICAgICAgICAvLyBQdXNoIHRvIG1haW5cbiAgICAgICAgdGhpcy5wdXNoQm9uZVJvdGF0aW9uQnVmZmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0Qm9uZVJvdGF0aW9ucyhzZW5kUmVzdWx0ID0gZmFsc2UpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5faW5pdEJvbmVSb3RhdGlvbnMpKSB7XG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW2tdLnNldChjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKHYpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VuZFJlc3VsdCkge1xuICAgICAgICAgICAgdGhpcy5wdXNoQm9uZVJvdGF0aW9uQnVmZmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbHRlckJvbmVSb3RhdGlvbnMoYm9uZU5hbWVzOiBzdHJpbmdbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgYm9uZU5hbWVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYm9uZVJvdGF0aW9uc1trXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNba10uc2V0KFF1YXRlcm5pb24uSWRlbnRpdHkoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEtleVBvaW50cygpIHtcbiAgICAgICAgLy8gR2V0IHBvaW50cyBmcm9tIGZhY2UgbWVzaFxuICAgICAgICB0aGlzLl9rZXlQb2ludHMudG9wX2ZhY2Vfb3ZhbCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzddWzBdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZmFjZV9vdmFsID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbN11bNl1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMuYm90dG9tX2ZhY2Vfb3ZhbCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzddWzE4XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9mYWNlX292YWwgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs3XVszMF1dO1xuXG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9pbm5lciA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzhdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9pbm5lciA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzNdWzhdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bMF1dO1xuXG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5tb3V0aF9sZWZ0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMTBdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX3JpZ2h0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX2ZpcnN0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMjRdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX3RvcF9zZWNvbmQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVsyNV1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX3RoaXJkID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMjZdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9maXJzdCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzZdWzM0XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5tb3V0aF9ib3R0b21fc2Vjb25kID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMzVdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV90aGlyZCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzZdWzM2XV07XG5cbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc190b3AgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVsxXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNF1bM11dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9pcmlzX2xlZnQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVsyXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfcmlnaHQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVswXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3RvcCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzVdWzFdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNV1bM11dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19sZWZ0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNV1bMl1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19yaWdodCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzVdWzBdXTtcblxuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfdG9wID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bMTJdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2JvdHRvbSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzRdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyX3NlY29uZGFyeSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzE0XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9vdXRlcl9zZWNvbmRhcnkgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFsyXVsxMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX3RvcCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzNdWzEyXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bNF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyX3NlY29uZGFyeSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzNdWzEwXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfaW5uZXJfc2Vjb25kYXJ5ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bMTRdXTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhbGN1bGF0ZSB0aGUgZmFjZSBvcmllbnRhdGlvbiBmcm9tIGxhbmRtYXJrcy5cbiAgICAgKiBMYW5kbWFya3MgZnJvbSBGYWNlIE1lc2ggdGFrZXMgcHJlY2VkZW5jZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNhbGNGYWNlQm9uZXMoKSB7XG4gICAgICAgIGNvbnN0IGF4aXNYID0gdGhpcy5fa2V5UG9pbnRzLmxlZnRfZmFjZV9vdmFsLnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5yaWdodF9mYWNlX292YWwucG9zKVxuICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICBjb25zdCBheGlzWSA9IHRoaXMuX2tleVBvaW50cy50b3BfZmFjZV9vdmFsLnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5ib3R0b21fZmFjZV9vdmFsLnBvcylcbiAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgaWYgKGF4aXNYLmxlbmd0aCgpID09PSAwIHx8IGF4aXNZLmxlbmd0aCgpID09PSAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHRoaXNCYXNpcyA9IG5ldyBCYXNpcyhbXG4gICAgICAgICAgICBheGlzWCxcbiAgICAgICAgICAgIGF4aXNZLFxuICAgICAgICAgICAgVmVjdG9yMy5Dcm9zcyhheGlzWCwgYXhpc1kpLFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyBEaXN0cmlidXRlIHJvdGF0aW9uIGJldHdlZW4gbmVjayBhbmQgaGVhZFxuICAgICAgICBjb25zdCBoZWFkUGFyZW50UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXCJoZWFkXCIsIGZhbHNlKTtcbiAgICAgICAgY29uc3QgaGVhZEJhc2lzID1cbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJoZWFkXCJdLnJvdGF0ZUJhc2lzKGhlYWRQYXJlbnRRdWF0ZXJuaW9uKTtcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXModGhpc0Jhc2lzLCBoZWFkQmFzaXMsIGhlYWRQYXJlbnRRdWF0ZXJuaW9uKSxcbiAgICAgICAgICAgIEFYSVMueFxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9oZWFkUXVhdGVybmlvbi51cGRhdGVSb3RhdGlvbihxdWF0ZXJuaW9uKTtcbiAgICAgICAgY29uc3Qgc2NhbGVkUXVhdGVybmlvbiA9IHNjYWxlUm90YXRpb24odGhpcy5faGVhZFF1YXRlcm5pb24ucm90LCAwLjUpO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaGVhZFwiXS5zZXQoc2NhbGVkUXVhdGVybmlvbik7XG4gICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJuZWNrXCJdLnNldChzY2FsZWRRdWF0ZXJuaW9uKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJlbWFwIHBvc2l0aW9uYWwgb2Zmc2V0cyB0byByb3RhdGlvbnMuXG4gICAgICogSXJpcyBvbmx5IGhhdmUgcG9zaXRpb25hbCBvZmZzZXRzLiBUaGVpciBub3JtYWxzIGFsd2F5cyBmYWNlIGZyb250LlxuICAgICAqL1xuICAgIHByaXZhdGUgY2FsY0lyaXNOb3JtYWwoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LmZhY2VMYW5kbWFya3MpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsZWZ0SXJpc0NlbnRlciA9IHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfdG9wLnBvc1xuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMubGVmdF9pcmlzX2JvdHRvbS5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfbGVmdC5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfcmlnaHQucG9zKVxuICAgICAgICAgICAgLnNjYWxlKDAuNSk7XG4gICAgICAgIGNvbnN0IHJpZ2h0SXJpc0NlbnRlciA9IHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3RvcC5wb3NcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfbGVmdC5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3JpZ2h0LnBvcylcbiAgICAgICAgICAgIC5zY2FsZSgwLjUpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBleWUgY2VudGVyXG4gICAgICAgIGNvbnN0IGxlZnRFeWVDZW50ZXIgPSB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfdG9wLnBvc1xuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyX3NlY29uZGFyeS5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9vdXRlcl9zZWNvbmRhcnkucG9zKVxuICAgICAgICAgICAgLnNjYWxlKDAuNSk7XG4gICAgICAgIGNvbnN0IHJpZ2h0RXllQ2VudGVyID0gdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV90b3AucG9zXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9vdXRlcl9zZWNvbmRhcnkucG9zKVxuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX2lubmVyX3NlY29uZGFyeS5wb3MpXG4gICAgICAgICAgICAuc2NhbGUoMC41KTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgb2Zmc2V0c1xuICAgICAgICBjb25zdCBsZWZ0RXllV2lkdGggPSB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfaW5uZXIucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyLnBvcylcbiAgICAgICAgICAgIC5sZW5ndGgoKTtcbiAgICAgICAgY29uc3QgcmlnaHRFeWVXaWR0aCA9IHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfaW5uZXIucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9vdXRlci5wb3MpXG4gICAgICAgICAgICAubGVuZ3RoKCk7XG5cbiAgICAgICAgY29uc3QgbGVmdElyaXNPZmZzZXQgPSBsZWZ0SXJpc0NlbnRlclxuICAgICAgICAgICAgLnN1YnRyYWN0KGxlZnRFeWVDZW50ZXIpXG4gICAgICAgICAgICAuc2NhbGUoUG9zZXMuRVlFX1dJRFRIX0JBU0VMSU5FIC8gbGVmdEV5ZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcmlnaHRJcmlzT2Zmc2V0ID0gcmlnaHRJcmlzQ2VudGVyXG4gICAgICAgICAgICAuc3VidHJhY3QocmlnaHRFeWVDZW50ZXIpXG4gICAgICAgICAgICAuc2NhbGUoUG9zZXMuRVlFX1dJRFRIX0JBU0VMSU5FIC8gcmlnaHRFeWVXaWR0aCk7XG5cbiAgICAgICAgLy8gUmVtYXAgb2Zmc2V0cyB0byBxdWF0ZXJuaW9uc1xuICAgICAgICBjb25zdCBsZWZ0SXJpc1JvdGF0aW9uWVBSID0gUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbChcbiAgICAgICAgICAgIHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgICAgIGxlZnRJcmlzT2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWF9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgICAgIGxlZnRJcmlzT2Zmc2V0LnksXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWV9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWV9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmlnaHRJcmlzUm90YXRpb25ZUFIgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKFxuICAgICAgICAgICAgcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAgICAgcmlnaHRJcmlzT2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWF9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgICAgIHJpZ2h0SXJpc09mZnNldC55LFxuICAgICAgICAgICAgICAgIC1Qb3Nlcy5JUklTX01QX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19NUF9ZX1JBTkdFLFxuICAgICAgICAgICAgICAgIC1Qb3Nlcy5JUklTX0JKU19ZX1JBTkdFLFxuICAgICAgICAgICAgICAgIFBvc2VzLklSSVNfQkpTX1lfUkFOR0VcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAwXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImxlZnRJcmlzXCJdLnNldChsZWZ0SXJpc1JvdGF0aW9uWVBSKTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcInJpZ2h0SXJpc1wiXS5zZXQocmlnaHRJcmlzUm90YXRpb25ZUFIpO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaXJpc1wiXS5zZXQoXG4gICAgICAgICAgICB0aGlzLmxSTGlua1F1YXRlcm5pb24obGVmdElyaXNSb3RhdGlvbllQUiwgcmlnaHRJcmlzUm90YXRpb25ZUFIpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjRXhwcmVzc2lvbnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LmZhY2VMYW5kbWFya3MpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsZWZ0VG9wVG9NaWRkbGUgPSBwb2ludExpbmVEaXN0YW5jZShcbiAgICAgICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV90b3AucG9zLFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyLnBvcyxcbiAgICAgICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9vdXRlci5wb3NcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbGVmdFRvcFRvQm90dG9tID0gdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX3RvcC5wb3NcbiAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5sZW5ndGgoKTtcbiAgICAgICAgY29uc3QgcmlnaHRUb3BUb01pZGRsZSA9IHBvaW50TGluZURpc3RhbmNlKFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV90b3AucG9zLFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9pbm5lci5wb3MsXG4gICAgICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyLnBvc1xuICAgICAgICApO1xuICAgICAgICBjb25zdCByaWdodFRvcFRvQm90dG9tID0gdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV90b3AucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9ib3R0b20ucG9zKVxuICAgICAgICAgICAgLmxlbmd0aCgpO1xuXG4gICAgICAgIHRoaXMuX2JsaW5rQmFzZS51cGRhdGVQb3NpdGlvbihcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgICAgIE1hdGgubG9nKGxlZnRUb3BUb01pZGRsZSAvIGxlZnRUb3BUb0JvdHRvbSArIDEpLFxuICAgICAgICAgICAgICAgIE1hdGgubG9nKHJpZ2h0VG9wVG9NaWRkbGUgLyByaWdodFRvcFRvQm90dG9tICsgMSksXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBsZXQgbGVmdFJhbmdlT2Zmc2V0ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX2xlZnRCbGlua0Fyci5sZW5ndGgoKSA+IDQpIHtcbiAgICAgICAgICAgIGxlZnRSYW5nZU9mZnNldCA9XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdEJsaW5rQXJyLnZhbHVlcy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgIChwLCBjLCBpKSA9PiBwICsgKGMgLSBwKSAvIChpICsgMSksXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICApIC0gUG9zZXMuQkxJTktfUkFUSU9fTE9XO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlZnRCbGluayA9IHJlbWFwUmFuZ2VOb0NhcChcbiAgICAgICAgICAgIHRoaXMuX2JsaW5rQmFzZS5wb3MueCxcbiAgICAgICAgICAgIFBvc2VzLkJMSU5LX1JBVElPX0xPVyArIGxlZnRSYW5nZU9mZnNldCxcbiAgICAgICAgICAgIFBvc2VzLkJMSU5LX1JBVElPX0hJR0ggKyBsZWZ0UmFuZ2VPZmZzZXQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9sZWZ0QmxpbmtBcnIucHVzaCh0aGlzLl9ibGlua0Jhc2UucG9zLngpO1xuXG4gICAgICAgIGxldCByaWdodFJhbmdlT2Zmc2V0ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX3JpZ2h0QmxpbmtBcnIubGVuZ3RoKCkgPiA0KSB7XG4gICAgICAgICAgICByaWdodFJhbmdlT2Zmc2V0ID1cbiAgICAgICAgICAgICAgICB0aGlzLl9yaWdodEJsaW5rQXJyLnZhbHVlcy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgIChwLCBjLCBpKSA9PiBwICsgKGMgLSBwKSAvIChpICsgMSksXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICApIC0gUG9zZXMuQkxJTktfUkFUSU9fTE9XO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJpZ2h0QmxpbmsgPSByZW1hcFJhbmdlTm9DYXAoXG4gICAgICAgICAgICB0aGlzLl9ibGlua0Jhc2UucG9zLnksXG4gICAgICAgICAgICBQb3Nlcy5CTElOS19SQVRJT19MT1cgKyByaWdodFJhbmdlT2Zmc2V0LFxuICAgICAgICAgICAgUG9zZXMuQkxJTktfUkFUSU9fSElHSCArIHJpZ2h0UmFuZ2VPZmZzZXQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9yaWdodEJsaW5rQXJyLnB1c2godGhpcy5fYmxpbmtCYXNlLnBvcy55KTtcblxuICAgICAgICBjb25zdCBibGluayA9IHRoaXMubFJMaW5rKGxlZnRCbGluaywgcmlnaHRCbGluayk7XG5cbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImJsaW5rXCJdLnNldChcbiAgICAgICAgICAgIG5ldyBRdWF0ZXJuaW9uKGxlZnRCbGluaywgcmlnaHRCbGluaywgYmxpbmssIDApXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgbW91dGhXaWR0aCA9IHRoaXMuX2tleVBvaW50cy5tb3V0aF9sZWZ0LnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5tb3V0aF9yaWdodC5wb3MpXG4gICAgICAgICAgICAubGVuZ3RoKCk7XG4gICAgICAgIGNvbnN0IG1vdXRoUmFuZ2UxID0gcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAodGhpcy5fa2V5UG9pbnRzLm1vdXRoX3RvcF9maXJzdC5wb3NcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9maXJzdC5wb3MpXG4gICAgICAgICAgICAgICAgLmxlbmd0aCgpICpcbiAgICAgICAgICAgICAgICBQb3Nlcy5NT1VUSF9XSURUSF9CQVNFTElORSkgL1xuICAgICAgICAgICAgICAgIG1vdXRoV2lkdGgsXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9MT1csXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9ISUdILFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbW91dGhSYW5nZTIgPSByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgICh0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX3NlY29uZC5wb3NcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9zZWNvbmQucG9zKVxuICAgICAgICAgICAgICAgIC5sZW5ndGgoKSAqXG4gICAgICAgICAgICAgICAgUG9zZXMuTU9VVEhfV0lEVEhfQkFTRUxJTkUpIC9cbiAgICAgICAgICAgICAgICBtb3V0aFdpZHRoLFxuICAgICAgICAgICAgUG9zZXMuTU9VVEhfTVBfUkFOR0VfTE9XLFxuICAgICAgICAgICAgUG9zZXMuTU9VVEhfTVBfUkFOR0VfSElHSCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG1vdXRoUmFuZ2UzID0gcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAodGhpcy5fa2V5UG9pbnRzLm1vdXRoX3RvcF90aGlyZC5wb3NcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV90aGlyZC5wb3MpXG4gICAgICAgICAgICAgICAgLmxlbmd0aCgpICpcbiAgICAgICAgICAgICAgICBQb3Nlcy5NT1VUSF9XSURUSF9CQVNFTElORSkgL1xuICAgICAgICAgICAgICAgIG1vdXRoV2lkdGgsXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9MT1csXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9ISUdILFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcIm1vdXRoXCJdLnNldChcbiAgICAgICAgICAgIG5ldyBRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIChtb3V0aFJhbmdlMSArIG1vdXRoUmFuZ2UyICsgbW91dGhSYW5nZTMpIC8gMyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY1Bvc2VCb25lcygpIHtcbiAgICAgICAgLy8gRG8gbm90IGNhbGN1bGF0ZSBwb3NlIGlmIG5vIHZpc2libGUgZmFjZS4gSXQgY2FuIGxlYWQgdG8gd2llcmQgcG9zZXMuXG4gICAgICAgIGlmICghdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3MpIHJldHVybjtcbiAgICAgICAgLy8gVXNlIGhpcHMgYXMgdGhlIHN0YXJ0aW5nIHBvaW50LiBSb3RhdGlvbiBvZiBoaXBzIGlzIGFsd2F5cyBvbiBYWiBwbGFuZS5cbiAgICAgICAgLy8gVXBwZXIgY2hlc3QgaXMgbm90IHVzZWQuXG4gICAgICAgIC8vIFRPRE8gZGVyaXZlIG5lY2sgYW5kIGNoZXN0IGZyb20gc3BpbmUgYW5kIGhlYWQuXG5cbiAgICAgICAgY29uc3QgbGVmdEhpcCA9IHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLkxFRlRfSElQXS5wb3M7XG4gICAgICAgIGNvbnN0IHJpZ2h0SGlwID0gdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuUklHSFRfSElQXS5wb3M7XG4gICAgICAgIGNvbnN0IGxlZnRTaG91bGRlciA9XG4gICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX1NIT1VMREVSXS5wb3M7XG4gICAgICAgIGNvbnN0IHJpZ2h0U2hvdWxkZXIgPVxuICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuUklHSFRfU0hPVUxERVJdLnBvcztcblxuICAgICAgICB0aGlzLnBvc2VOb3JtYWxzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gSGlwc1xuICAgICAgICBjb25zdCB3b3JsZFhaUGxhbmUgPSBQbGFuZS5Gcm9tUG9zaXRpb25BbmROb3JtYWwoXG4gICAgICAgICAgICBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGhpcExpbmUgPSBsZWZ0SGlwLnN1YnRyYWN0KHJpZ2h0SGlwKTtcbiAgICAgICAgY29uc3QgaGlwTGluZVByb2ogPSBwcm9qZWN0VmVjdG9yT25QbGFuZSh3b3JsZFhaUGxhbmUsIGhpcExpbmUpO1xuICAgICAgICBjb25zdCBoaXBSb3RhdGlvbkFuZ2xlID0gTWF0aC5hdGFuMihoaXBMaW5lUHJvai56LCBoaXBMaW5lUHJvai54KTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImhpcHNcIl0uc2V0KFxuICAgICAgICAgICAgUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgaGlwUm90YXRpb25BbmdsZSwgMClcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDaGVzdC9TaG91bGRlclxuICAgICAgICBjb25zdCBzaG91bGRlck5vcm1SID0gUGxhbmUuRnJvbVBvaW50cyhcbiAgICAgICAgICAgIHJpZ2h0U2hvdWxkZXIsXG4gICAgICAgICAgICBsZWZ0U2hvdWxkZXIsXG4gICAgICAgICAgICByaWdodEhpcFxuICAgICAgICApLm5vcm1hbDtcbiAgICAgICAgY29uc3Qgc2hvdWxkZXJOb3JtTCA9IFBsYW5lLkZyb21Qb2ludHMoXG4gICAgICAgICAgICByaWdodFNob3VsZGVyLFxuICAgICAgICAgICAgbGVmdFNob3VsZGVyLFxuICAgICAgICAgICAgbGVmdEhpcFxuICAgICAgICApLm5vcm1hbDtcbiAgICAgICAgY29uc3Qgc2hvdWxkZXJOb3JtYWwgPSBzaG91bGRlck5vcm1MLmFkZChzaG91bGRlck5vcm1SKS5ub3JtYWxpemUoKTtcblxuICAgICAgICAvLyBTcGluZVxuICAgICAgICBpZiAoc2hvdWxkZXJOb3JtYWwubGVuZ3RoKCkgPiAwLjEpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwaW5lUGFyZW50UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgXCJzcGluZVwiLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgc3BpbmVCYXNpcyA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJzcGluZVwiXS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgICAgICBzcGluZVBhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBuZXdTcGluZUJhc2lzWSA9IHJpZ2h0U2hvdWxkZXJcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QobGVmdFNob3VsZGVyKVxuICAgICAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NwaW5lQmFzaXMgPSBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgIHNob3VsZGVyTm9ybWFsLFxuICAgICAgICAgICAgICAgIG5ld1NwaW5lQmFzaXNZLFxuICAgICAgICAgICAgICAgIFZlY3RvcjMuQ3Jvc3Moc2hvdWxkZXJOb3JtYWwsIG5ld1NwaW5lQmFzaXNZKSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wic3BpbmVcIl0uc2V0KFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgcXVhdGVybmlvbkJldHdlZW5CYXNlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwaW5lQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGluZUJhc2lzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BpbmVQYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjV3Jpc3RCb25lcygpO1xuXG4gICAgICAgIC8vIEFybXNcbiAgICAgICAgbGV0IHRoZXRhID0gMCxcbiAgICAgICAgICAgIHBoaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBMUikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2hhbGxVcGRhdGVBcm0oaXNMZWZ0KSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtS2V5ID0gYCR7a31VcHBlckFybWA7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRlckxhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgUE9TRV9MQU5ETUFSS1NbXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtrLnRvVXBwZXJDYXNlKCl9X1NIT1VMREVSYCBhcyBrZXlvZiB0eXBlb2YgUE9TRV9MQU5ETUFSS1NcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIF0ucG9zO1xuICAgICAgICAgICAgY29uc3QgZWxib3dMYW5kbWFyayA9XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9FTEJPV2AgYXMga2V5b2YgdHlwZW9mIFBPU0VfTEFORE1BUktTXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcbiAgICAgICAgICAgIGNvbnN0IHdyaXN0TGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLU1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fV1JJU1RgIGFzIGtleW9mIHR5cGVvZiBQT1NFX0xBTkRNQVJLU1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG5cbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtRGlyID0gZWxib3dMYW5kbWFya1xuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChzaG91bGRlckxhbmRtYXJrKVxuICAgICAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtUGFyZW50UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgdXBwZXJBcm1LZXksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1cHBlckFybUJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1t1cHBlckFybUtleV0ucm90YXRlQmFzaXMoXG4gICAgICAgICAgICAgICAgdXBwZXJBcm1QYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQodXBwZXJBcm1EaXIsIHVwcGVyQXJtQmFzaXMpO1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1t1cHBlckFybUtleV0uc2V0KFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJBcm1CYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJBcm1QYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBSb3RhdGUgbG93ZXIgYXJtcyBhcm91bmQgWCBheGlzIHRvZ2V0aGVyIHdpdGggaGFuZHMuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgY29tYmluYXRpb24gb2Ygc3BoZXJpY2FsIGNvb3JkaW5hdGVzIHJvdGF0aW9uIGFuZCByb3RhdGlvbiBiZXR3ZWVuIGJhc2VzLlxuICAgICAgICAgICAgY29uc3QgaGFuZE5vcm1hbCA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gdGhpcy5sZWZ0SGFuZE5vcm1hbFxuICAgICAgICAgICAgICAgIDogdGhpcy5yaWdodEhhbmROb3JtYWw7XG4gICAgICAgICAgICBjb25zdCBsb3dlckFybUtleSA9IGAke2t9TG93ZXJBcm1gO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJBcm1EaXIgPSB3cmlzdExhbmRtYXJrXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KGVsYm93TGFuZG1hcmspXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJBcm1QcmV2UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1LZXksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBsb3dlckFybUJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tsb3dlckFybUtleV0ucm90YXRlQmFzaXMoXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1QcmV2UXVhdGVybmlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFt0aGV0YSwgcGhpXSA9IGNhbGNTcGhlcmljYWxDb29yZChsb3dlckFybURpciwgbG93ZXJBcm1CYXNpcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmROb3JtYWxzS2V5ID0gYCR7a31IYW5kTm9ybWFsc2A7XG4gICAgICAgICAgICBjb25zdCBoYW5kTm9ybWFscyA9IHRoaXNbXG4gICAgICAgICAgICAgICAgaGFuZE5vcm1hbHNLZXkgYXMgUG9zZXNLZXlcbiAgICAgICAgICAgIF0gYXMgTm9ybWFsaXplZExhbmRtYXJrTGlzdDtcbiAgICAgICAgICAgIGhhbmROb3JtYWxzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0UXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyQXJtQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICBwaGksXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyQXJtUHJldlF1YXRlcm5pb25cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBmaW5hbFF1YXRlcm5pb24gPSB0aGlzLmFwcGx5WFJvdGF0aW9uV2l0aENoaWxkKFxuICAgICAgICAgICAgICAgIGxvd2VyQXJtS2V5LFxuICAgICAgICAgICAgICAgIGxvd2VyQXJtUHJldlF1YXRlcm5pb24sXG4gICAgICAgICAgICAgICAgZmlyc3RRdWF0ZXJuaW9uLFxuICAgICAgICAgICAgICAgIGhhbmROb3JtYWwsXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1CYXNpc1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tsb3dlckFybUtleV0uc2V0KGZpbmFsUXVhdGVybmlvbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHJvdGF0aW9ucyBvbiB3cmlzdHNcbiAgICAgICAgdGhpcy5jYWxjV3Jpc3RCb25lcyhmYWxzZSk7XG5cbiAgICAgICAgLy8gTGVncyBhbmQgZmVldFxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgTFIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNoYWxsVXBkYXRlTGVncyhpc0xlZnQpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgdGhpc0xhbmRtYXJrcyA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVFxuICAgICAgICAgICAgICAgIDogUE9TRV9MQU5ETUFSS1NfUklHSFQ7XG4gICAgICAgICAgICBjb25zdCB1cHBlckxlZ0tleSA9IGAke2t9VXBwZXJMZWdgO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJMZWdLZXkgPSBgJHtrfUxvd2VyTGVnYDtcbiAgICAgICAgICAgIGNvbnN0IGhpcExhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgdGhpc0xhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fSElQYCBhcyBrZXlvZiB0eXBlb2YgdGhpc0xhbmRtYXJrc1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG4gICAgICAgICAgICBjb25zdCBrbmVlTGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICB0aGlzTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9LTkVFYCBhcyBrZXlvZiB0eXBlb2YgdGhpc0xhbmRtYXJrc1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG4gICAgICAgICAgICBjb25zdCBhbmtsZUxhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgdGhpc0xhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fQU5LTEVgIGFzIGtleW9mIHR5cGVvZiB0aGlzTGFuZG1hcmtzXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcblxuICAgICAgICAgICAgY29uc3QgdXBwZXJMZWdEaXIgPSBrbmVlTGFuZG1hcmsuc3VidHJhY3QoaGlwTGFuZG1hcmspLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgdXBwZXJMZWdQYXJlbnRRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICB1cHBlckxlZ0tleSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVwcGVyTGVnQmFzaXMgPSB0aGlzLl9ib25lUm90YXRpb25zW3VwcGVyTGVnS2V5XS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgICAgICB1cHBlckxlZ1BhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQodXBwZXJMZWdEaXIsIHVwcGVyTGVnQmFzaXMpO1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1t1cHBlckxlZ0tleV0uc2V0KFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJMZWdCYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJMZWdQYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBsb3dlckxlZ0RpciA9IGFua2xlTGFuZG1hcmtcbiAgICAgICAgICAgICAgICAuc3VidHJhY3Qoa25lZUxhbmRtYXJrKVxuICAgICAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyTGVnUHJldlF1YXRlcm5pb24gPSB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKFxuICAgICAgICAgICAgICAgIGxvd2VyTGVnS2V5LFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJMZWdCYXNpcyA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbbG93ZXJMZWdLZXldLnJvdGF0ZUJhc2lzKFxuICAgICAgICAgICAgICAgIGxvd2VyTGVnUHJldlF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQobG93ZXJMZWdEaXIsIGxvd2VyTGVnQmFzaXMpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3RRdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgIHNwaGVyaWNhbFRvUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJMZWdCYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgdGhldGEsXG4gICAgICAgICAgICAgICAgICAgIHBoaSxcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJMZWdQcmV2UXVhdGVybmlvblxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbbG93ZXJMZWdLZXldLnNldChmaXJzdFF1YXRlcm5pb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjRmVldEJvbmVzKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGlzS2V5OiBrZXkgaW4gX2JvbmVSb3RhdGlvbnNcbiAgICAgKiBwcmV2UXVhdGVybmlvbjogUGFyZW50IGN1bXVsYXRlZCByb3RhdGlvbiBxdWF0ZXJuaW9uXG4gICAgICogZmlyc3RRdWF0ZXJuaW9uOiBSb3RhdGlvbiBxdWF0ZXJuaW9uIGNhbGN1bGF0ZWQgd2l0aG91dCBhcHBseWluZyBYIHJvdGF0aW9uXG4gICAgICogbm9ybWFsOiBBIG5vcm1hbCBwb2ludGluZyB0byBsb2NhbCAteVxuICAgICAqIHRoaXNCYXNpczogYmFzaXMgb24gdGhpcyBub2RlIGFmdGVyIHByZXZRdWF0ZXJuaW9uIGlzIGFwcGxpZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFwcGx5WFJvdGF0aW9uV2l0aENoaWxkKFxuICAgICAgICB0aGlzS2V5OiBzdHJpbmcsXG4gICAgICAgIHByZXZRdWF0ZXJuaW9uOiBRdWF0ZXJuaW9uLFxuICAgICAgICBmaXJzdFF1YXRlcm5pb246IFF1YXRlcm5pb24sXG4gICAgICAgIG5vcm1hbDogVmVjdG9yMyxcbiAgICAgICAgdGhpc0Jhc2lzOiBCYXNpc1xuICAgICkge1xuICAgICAgICBjb25zdCB0aGlzUm90YXRlZEJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1t0aGlzS2V5XS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgIHByZXZRdWF0ZXJuaW9uLm11bHRpcGx5KHJldmVyc2VSb3RhdGlvbihmaXJzdFF1YXRlcm5pb24sIEFYSVMueXopKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHRoaXNZWlBsYW5lID0gUGxhbmUuRnJvbVBvc2l0aW9uQW5kTm9ybWFsKFxuICAgICAgICAgICAgVmVjdG9yMy5aZXJvKCksXG4gICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnguY2xvbmUoKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwcm9qZWN0ZWROb3JtYWwgPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgcHJvamVjdFZlY3Rvck9uUGxhbmUodGhpc1laUGxhbmUsIG5vcm1hbCkucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYoXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLkludmVyc2UoXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy54LmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnouY2xvbmUoKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBwcm9qZWN0ZWROb3JtYWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJvamVjdGVkUHJldlogPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgcHJvamVjdFZlY3Rvck9uUGxhbmUoXG4gICAgICAgICAgICB0aGlzWVpQbGFuZSxcbiAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMuei5uZWdhdGUoKVxuICAgICAgICApLnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JbnZlcnNlKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uUm90YXRpb25RdWF0ZXJuaW9uRnJvbUF4aXMoXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnkuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy56LmNsb25lKClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcHJvamVjdGVkUHJldlpcbiAgICAgICAgKTtcbiAgICAgICAgcHJvamVjdGVkUHJldloubm9ybWFsaXplKCk7XG4gICAgICAgIGxldCB4UHJldiA9IE1hdGguYXRhbjIocHJvamVjdGVkUHJldloueSwgLXByb2plY3RlZFByZXZaLnopO1xuICAgICAgICBsZXQgeEFuZ2xlID0gTWF0aC5hdGFuMihwcm9qZWN0ZWROb3JtYWwueSwgLXByb2plY3RlZE5vcm1hbC56KTtcbiAgICAgICAgaWYgKHhBbmdsZSA+IDApIHhBbmdsZSAtPSBNYXRoLlBJICogMjtcbiAgICAgICAgaWYgKHhBbmdsZSA8IC1NYXRoLlBJICogMS4yNSkgeEFuZ2xlID0geFByZXY7XG4gICAgICAgIC8vIGlmIChpc0xlZykge1xuICAgICAgICAvLyAgICAgaWYgKE1hdGguYWJzKHhBbmdsZSkgPiBNYXRoLlBJICogMC4yNzc4ICYmIE1hdGguYWJzKHhBbmdsZSkgPCBNYXRoLlBJIC8gMikge1xuICAgICAgICAvLyAgICAgICAgIHhBbmdsZSAtPSBNYXRoLlBJICogMC4yNzc4O1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICB4QW5nbGUgPSB4UHJldjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IHRoaXNYUm90YXRlZEJhc2lzID0gdGhpc1JvdGF0ZWRCYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyhcbiAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnguY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAoeEFuZ2xlIC0geFByZXYpICogMC41XG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIC8vIFRoZSBxdWF0ZXJuaW9uIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICAgICAgY29uc3Qgc2Vjb25kUXVhdGVybmlvbiA9IHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgICAgICAgICB0aGlzQmFzaXMsXG4gICAgICAgICAgICB0aGlzWFJvdGF0ZWRCYXNpcyxcbiAgICAgICAgICAgIHByZXZRdWF0ZXJuaW9uXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZmluYWxRdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKHNlY29uZFF1YXRlcm5pb24sIEFYSVMueXopO1xuICAgICAgICByZXR1cm4gZmluYWxRdWF0ZXJuaW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY1dyaXN0Qm9uZXMoZmlyc3RQYXNzID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBoYW5kcyA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubGVmdEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICByaWdodDogdGhpcy5yaWdodEhhbmRMYW5kbWFya3MsXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoaGFuZHMpKSB7XG4gICAgICAgICAgICBjb25zdCBpc0xlZnQgPSBrID09PSBcImxlZnRcIjtcbiAgICAgICAgICAgIGNvbnN0IHdyaXN0VmlzaWxpYml0eSA9XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQT1NFX0xBTkRNQVJLUy5MRUZUX1dSSVNUXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTLlJJR0hUX1dSSVNUXG4gICAgICAgICAgICAgICAgXS52aXNpYmlsaXR5IHx8IDA7XG4gICAgICAgICAgICBpZiAod3Jpc3RWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgdmVydGljZXM6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IzW10gPSBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1BdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1BdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLk1JRERMRV9GSU5HRVJfTUNQXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgLy8gUm9vdCBub3JtYWxcbiAgICAgICAgICAgIGNvbnN0IGhhbmROb3JtYWwgPSBpc0xlZnRcbiAgICAgICAgICAgICAgICA/IHRoaXMubGVmdEhhbmROb3JtYWxcbiAgICAgICAgICAgICAgICA6IHRoaXMucmlnaHRIYW5kTm9ybWFsO1xuICAgICAgICAgICAgY29uc3Qgcm9vdE5vcm1hbCA9IHZlcnRpY2VzXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBfbm9ybWFsID0gUG9zZXMubm9ybWFsRnJvbVZlcnRpY2VzKGN1cnIsIGlzTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmROb3JtYWxzLnB1c2godmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsoX25vcm1hbCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldi5hZGQoX25vcm1hbCk7XG4gICAgICAgICAgICAgICAgfSwgVmVjdG9yMy5aZXJvKCkpXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgaGFuZE5vcm1hbC5jb3B5RnJvbShyb290Tm9ybWFsKTtcbiAgICAgICAgICAgIC8vIGhhbmROb3JtYWxzLnB1c2godmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsocm9vdE5vcm1hbCkpO1xuXG4gICAgICAgICAgICBjb25zdCB0aGlzV3Jpc3RSb3RhdGlvbiA9XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcbiAgICAgICAgICAgICAgICAgICAgaGFuZExhbmRNYXJrVG9Cb25lTmFtZShIQU5EX0xBTkRNQVJLUy5XUklTVCwgaXNMZWZ0KVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICBjb25zdCBiYXNpczE6IEJhc2lzID0gdGhpc1dyaXN0Um90YXRpb24uYmFzZUJhc2lzO1xuXG4gICAgICAgICAgICAvLyBQcm9qZWN0IHBhbG0gbGFuZG1hcmtzIHRvIGF2ZXJhZ2UgcGxhbmVcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RlZExhbmRtYXJrcyA9IGNhbGNBdmdQbGFuZShcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuV1JJU1RdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfTUNQXS5wb3MsXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuTUlERExFX0ZJTkdFUl9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJvb3ROb3JtYWxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBiYXNpczIgPSBnZXRCYXNpcyhbXG4gICAgICAgICAgICAgICAgcHJvamVjdGVkTGFuZG1hcmtzWzBdLFxuICAgICAgICAgICAgICAgIHByb2plY3RlZExhbmRtYXJrc1sxXSxcbiAgICAgICAgICAgICAgICBwcm9qZWN0ZWRMYW5kbWFya3NbNF0sXG4gICAgICAgICAgICBdKS5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICAgICAgSEFORF9MQU5ETUFSS1MuV1JJU1QsXG4gICAgICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICkuY29uanVnYXRlKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB3cmlzdFJvdGF0aW9uUXVhdGVybmlvblJhdyA9IHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgICAgICAgICAgICAgYmFzaXMxLFxuICAgICAgICAgICAgICAgIGJhc2lzMlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3Qgd3Jpc3RSb3RhdGlvblF1YXRlcm5pb24gPSByZXZlcnNlUm90YXRpb24oXG4gICAgICAgICAgICAgICAgd3Jpc3RSb3RhdGlvblF1YXRlcm5pb25SYXcsXG4gICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghZmlyc3RQYXNzKSB0aGlzV3Jpc3RSb3RhdGlvbi5zZXQod3Jpc3RSb3RhdGlvblF1YXRlcm5pb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjSGFuZEJvbmVzKCkge1xuICAgICAgICAvLyBSaWdodCBoYW5kIHNoYWxsIGhhdmUgbG9jYWwgeCByZXZlcnNlZD9cbiAgICAgICAgY29uc3QgaGFuZHMgPSB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgcmlnaHQ6IHRoaXMucmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGhhbmRzKSkge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgSEFORF9MQU5ETUFSS19MRU5HVEg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChpICUgNCA9PT0gMCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzSGFuZFJvdGF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1toYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGksIGlzTGVmdCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNMYW5kbWFyayA9IHZbaV0ucG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dExhbmRtYXJrID0gdltpICsgMV0ucG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNEaXIgPSBuZXh0TGFuZG1hcmsuc3VidHJhY3QodGhpc0xhbmRtYXJrKS5ub3JtYWxpemUoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihpLCBpc0xlZnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNCYXNpcyA9IHRoaXNIYW5kUm90YXRpb24ucm90YXRlQmFzaXMocHJldlF1YXRlcm5pb24pO1xuXG4gICAgICAgICAgICAgICAgLy8gUHJvamVjdCBsYW5kbWFyayB0byBYWiBwbGFuZSBmb3Igc2Vjb25kIGFuZCB0aGlyZCBzZWdtZW50c1xuICAgICAgICAgICAgICAgIGlmIChpICUgNCA9PT0gMiB8fCBpICUgNCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9qUGxhbmUgPSBQbGFuZS5Gcm9tUG9zaXRpb25BbmROb3JtYWwoXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNCYXNpcy55LmNsb25lKClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpc0RpciA9IHByb2plY3RWZWN0b3JPblBsYW5lKHByb2pQbGFuZSwgdGhpc0Rpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQodGhpc0RpciwgdGhpc0Jhc2lzKTtcblxuICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gdXNlIG9yaWdpbmFsIEJhc2lzLCBiZWNhdXNlIHRoZSBxdWF0ZXJuaW9uIGZyb21cbiAgICAgICAgICAgICAgICAvLyBSb3RhdGlvbkF4aXMgaW5oZXJlbnRseSB1c2VzIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgICAgICAgICAgICAgIGxldCB0aGlzUm90YXRpb25RdWF0ZXJuaW9uO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxyQ29lZmYgPSBpc0xlZnQgPyAtMSA6IDE7XG4gICAgICAgICAgICAgICAgLy8gVGh1bWIgcm90YXRpb25zIGFyZSB5IG1haW4uIE90aGVycyBhcmUgeiBtYWluLlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUF4aXMgPVxuICAgICAgICAgICAgICAgICAgICBpICUgNCA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBpIDwgNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gQVhJUy5ub25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBBWElTLnhcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaSA8IDRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gQVhJUy54elxuICAgICAgICAgICAgICAgICAgICAgICAgOiBBWElTLnh5O1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2FwQXhpcyA9IGkgPCA0ID8gQVhJUy56IDogQVhJUy55O1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlY29uZENhcEF4aXMgPSBpIDwgNCA/IEFYSVMueSA6IEFYSVMuejtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRDYXAgPSBpIDwgMiA/IDE1IDogMTEwO1xuICAgICAgICAgICAgICAgIHRoaXNSb3RhdGlvblF1YXRlcm5pb24gPSByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGV0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBoaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUF4aXMsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Q2FwQXhpcyxcbiAgICAgICAgICAgICAgICAgICAgLTE1LFxuICAgICAgICAgICAgICAgICAgICAxNSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kQ2FwQXhpcyxcbiAgICAgICAgICAgICAgICAgICAgbHJDb2VmZiAqIC0xNSxcbiAgICAgICAgICAgICAgICAgICAgbHJDb2VmZiAqIHNlY29uZENhcFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpc1JvdGF0aW9uUXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0aW9uUXVhdGVybmlvbixcbiAgICAgICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpc0hhbmRSb3RhdGlvbi5zZXQodGhpc1JvdGF0aW9uUXVhdGVybmlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNGZWV0Qm9uZXMoZmlyc3RQYXNzID0gdHJ1ZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgTFIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNoYWxsVXBkYXRlTGVncyhpc0xlZnQpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgbGFuZG1hcmtCYXNpcyA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gZ2V0QmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9IRUVMXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLU19MRUZULkxFRlRfRk9PVF9JTkRFWFxuICAgICAgICAgICAgICAgICAgICAgIF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9BTktMRV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnBvcyxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBnZXRCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1NfUklHSFQuUklHSFRfSEVFTF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUE9TRV9MQU5ETUFSS1NfUklHSFQuUklHSFRfRk9PVF9JTkRFWFxuICAgICAgICAgICAgICAgICAgICAgIF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0FOS0xFXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zLFxuICAgICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvb3RCb25lS2V5ID0gYCR7a31Gb290YDtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNCYXNpcyA9IGxhbmRtYXJrQmFzaXNcbiAgICAgICAgICAgICAgICAubmVnYXRlQXhlcyhBWElTLnl6KVxuICAgICAgICAgICAgICAgIC50cmFuc3Bvc2UoWzEsIDIsIDBdKTtcbiAgICAgICAgICAgIHRoaXNCYXNpcy52ZXJpZnlCYXNpcygpO1xuXG4gICAgICAgICAgICAvLyBSb290IG5vcm1hbFxuICAgICAgICAgICAgY29uc3QgZm9vdE5vcm1hbCA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gdGhpcy5sZWZ0Rm9vdE5vcm1hbFxuICAgICAgICAgICAgICAgIDogdGhpcy5yaWdodEZvb3ROb3JtYWw7XG4gICAgICAgICAgICBmb290Tm9ybWFsLmNvcHlGcm9tKHRoaXNCYXNpcy56Lm5lZ2F0ZSgpKTtcblxuICAgICAgICAgICAgY29uc3QgdGhpc0Zvb3RSb3RhdGlvbiA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbZm9vdEJvbmVLZXldO1xuICAgICAgICAgICAgY29uc3QgYmFzaXMxOiBCYXNpcyA9IHRoaXNGb290Um90YXRpb24uYmFzZUJhc2lzO1xuICAgICAgICAgICAgY29uc3QgYmFzaXMyID0gdGhpc0Jhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKGZvb3RCb25lS2V5LCBpc0xlZnQpLmNvbmp1Z2F0ZSgpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgZm9vdFJvdGF0aW9uUXVhdGVybmlvblJhdyA9IHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgICAgICAgICAgICAgYmFzaXMxLFxuICAgICAgICAgICAgICAgIGJhc2lzMlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgZm9vdFJvdGF0aW9uUXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICBmb290Um90YXRpb25RdWF0ZXJuaW9uUmF3LFxuICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWZpcnN0UGFzcykgdGhpc0Zvb3RSb3RhdGlvbi5zZXQoZm9vdFJvdGF0aW9uUXVhdGVybmlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHByZVByb2Nlc3NSZXN1bHRzKCkge1xuICAgICAgICAvLyBQcmVwcm9jZXNzaW5nIHJlc3VsdHNcbiAgICAgICAgLy8gQ3JlYXRlIHBvc2UgbGFuZG1hcmsgbGlzdFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGlucHV0V29ybGRQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0IHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIC8vKiBUT0RPOiBQYXRjaGVkLlxuICAgICAgICAgICAgLy8qIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MDgzMzg5L2lnbm9yZS10eXBlc2NyaXB0LWVycm9ycy1wcm9wZXJ0eS1kb2VzLW5vdC1leGlzdC1vbi12YWx1ZS1vZi10eXBlXG4gICAgICAgICAgICAvLyB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8uZWE7IC8vIFNlZW1zIHRvIGJlIHRoZSBuZXcgcG9zZV93b3JsZF9sYW5kbWFya1xuICAgICAgICAgICAgKHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzIGFzIGFueSk/LmVhOyAvLyBTZWVtcyB0byBiZSB0aGUgbmV3IHBvc2Vfd29ybGRfbGFuZG1hcmtcbiAgICAgICAgY29uc3QgaW5wdXRQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0IHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzOyAvLyBTZWVtcyB0byBiZSB0aGUgbmV3IHBvc2Vfd29ybGRfbGFuZG1hcmtcbiAgICAgICAgaWYgKGlucHV0V29ybGRQb3NlTGFuZG1hcmtzICYmIGlucHV0UG9zZUxhbmRtYXJrcykge1xuICAgICAgICAgICAgaWYgKGlucHV0V29ybGRQb3NlTGFuZG1hcmtzLmxlbmd0aCAhPT0gUE9TRV9MQU5ETUFSS19MRU5HVEgpXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICBgUG9zZSBMYW5kbWFyayBsaXN0IGhhcyBhIGxlbmd0aCBsZXNzIHRoYW4gJHtQT1NFX0xBTkRNQVJLX0xFTkdUSH0hYFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXRQb3NlTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0V29ybGRQb3NlTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKGlucHV0UG9zZUxhbmRtYXJrcywgdGhpcy5wb3NlTGFuZG1hcmtzKTtcblxuICAgICAgICAgICAgLy8gUG9zaXRpb25hbCBvZmZzZXRcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoaW5wdXRXb3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuTEVGVF9ISVBdLnZpc2liaWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgMCkgPiBWSVNJQklMSVRZX1RIUkVTSE9MRCAmJlxuICAgICAgICAgICAgICAgIChpbnB1dFdvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5SSUdIVF9ISVBdLnZpc2liaWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgMCkgPiBWSVNJQklMSVRZX1RIUkVTSE9MRFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWlkSGlwUG9zID0gdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX0hJUF0ucG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHRoaXMucG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5SSUdIVF9ISVBdLnBvcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zY2FsZUluUGxhY2UoMC41KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbWlkSGlwUG9zLnogPSAwOyAvLyBObyBkZXB0aCBpbmZvXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1pZEhpcEluaXRPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taWRIaXBJbml0T2Zmc2V0ID0gbWlkSGlwUG9zO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMubWlkSGlwSW5pdE9mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWlkSGlwT2Zmc2V0LnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pZEhpcFBvcy54IC0gdGhpcy5taWRIaXBJbml0T2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaWRIaXBQb3MueSAtIHRoaXMubWlkSGlwSW5pdE9mZnNldC55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWlkSGlwUG9zLnogLSB0aGlzLm1pZEhpcEluaXRPZmZzZXQuelxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBkZWx0YV94IGluc3RlYWQgb2YgeFxuICAgICAgICAgICAgICAgIHRoaXMubWlkSGlwUG9zID0gdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWlkSGlwT2Zmc2V0LnBvc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbnB1dEZhY2VMYW5kbWFya3MgPSB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8uZmFjZUxhbmRtYXJrczsgLy8gU2VlbXMgdG8gYmUgdGhlIG5ldyBwb3NlX3dvcmxkX2xhbmRtYXJrXG4gICAgICAgIGlmIChpbnB1dEZhY2VMYW5kbWFya3MpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRGYWNlTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0RmFjZUxhbmRtYXJrcyxcbiAgICAgICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiB1cGRhdGUgd3Jpc3Qgb2Zmc2V0IG9ubHkgd2hlbiBkZWJ1Z2dpbmdcbiAgICAgICAgY29uc3QgaW5wdXRMZWZ0SGFuZExhbmRtYXJrcyA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ubGVmdEhhbmRMYW5kbWFya3M7XG4gICAgICAgIGNvbnN0IGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5yaWdodEhhbmRMYW5kbWFya3M7XG4gICAgICAgIGlmIChpbnB1dExlZnRIYW5kTGFuZG1hcmtzKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRXcmlzdE9mZnNldC51cGRhdGVQb3NpdGlvbihcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX1dSSVNUXS5wb3Muc3VidHJhY3QoXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRMZWZ0SGFuZExhbmRtYXJrc1tIQU5EX0xBTkRNQVJLUy5XUklTVF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBQb3Nlcy5IQU5EX1BPU0lUSU9OX1NDQUxJTkcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5pbnB1dExlZnRIYW5kTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0TGVmdEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRXcmlzdE9mZnNldC5wb3MsXG4gICAgICAgICAgICAgICAgUG9zZXMuSEFORF9QT1NJVElPTl9TQ0FMSU5HXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dFJpZ2h0SGFuZExhbmRtYXJrcykge1xuICAgICAgICAgICAgdGhpcy5yaWdodFdyaXN0T2Zmc2V0LnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLUy5SSUdIVF9XUklTVFxuICAgICAgICAgICAgICAgIF0ucG9zLnN1YnRyYWN0KFxuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTGFuZG1hcmtUb1ZlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzW0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFBvc2VzLkhBTkRfUE9TSVRJT05fU0NBTElORyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmlucHV0UmlnaHRIYW5kTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRXcmlzdE9mZnNldC5wb3MsXG4gICAgICAgICAgICAgICAgUG9zZXMuSEFORF9QT1NJVElPTl9TQ0FMSU5HXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICByZXN1bHRzTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtbXSxcbiAgICAgICAgZmlsdGVyZWRMYW5kbWFya3M6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0LFxuICAgICAgICBvZmZzZXQgPSBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgc2NhbGluZyA9IDFcbiAgICApIHtcbiAgICAgICAgLy8gUmV2ZXJzZSBZLWF4aXMuIElucHV0IHJlc3VsdHMgdXNlIGNhbnZhcyBjb29yZGluYXRlIHN5c3RlbS5cbiAgICAgICAgcmVzdWx0c0xhbmRtYXJrcy5tYXAoKHYpID0+IHtcbiAgICAgICAgICAgIHYueCA9IHYueCAqIHNjYWxpbmcgKyBvZmZzZXQueDtcbiAgICAgICAgICAgIHYueSA9IC12LnkgKiBzY2FsaW5nICsgb2Zmc2V0Lnk7XG4gICAgICAgICAgICB2LnogPSB2LnogKiBzY2FsaW5nICsgb2Zmc2V0Lno7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBOb2lzZSBmaWx0ZXJpbmdcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzTGFuZG1hcmtzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZExhbmRtYXJrc1tpXS51cGRhdGVQb3NpdGlvbihcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkTGFuZG1hcmtUb1ZlY3RvcihyZXN1bHRzTGFuZG1hcmtzW2ldKSxcbiAgICAgICAgICAgICAgICByZXN1bHRzTGFuZG1hcmtzW2ldLnZpc2liaWxpdHlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNMYW5kbWFya3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b0Nsb25lYWJsZUxhbmRtYXJrcyhcbiAgICAgICAgbGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCxcbiAgICAgICAgY2xvbmVhYmxlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0XG4gICAgKSB7XG4gICAgICAgIGNsb25lYWJsZUxhbmRtYXJrcy5mb3JFYWNoKCh2LCBpZHgpID0+IHtcbiAgICAgICAgICAgIHYueCA9IGxhbmRtYXJrc1tpZHhdLnBvcy54O1xuICAgICAgICAgICAgdi55ID0gbGFuZG1hcmtzW2lkeF0ucG9zLnk7XG4gICAgICAgICAgICB2LnogPSBsYW5kbWFya3NbaWR4XS5wb3MuejtcbiAgICAgICAgICAgIHYudmlzaWJpbGl0eSA9IGxhbmRtYXJrc1tpZHhdLnZpc2liaWxpdHk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmlsdGVyRmFjZUxhbmRtYXJrcygpIHtcbiAgICAgICAgLy8gVW5wYWNrIGZhY2UgbWVzaCBsYW5kbWFya3NcbiAgICAgICAgdGhpcy5fZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdC5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9mYWNlTWVzaExhbmRtYXJrTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFBvc2VzLkZBQ0VfTUVTSF9DT05ORUNUSU9OUy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgICAgICBjb25zdCBpZHggPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICAgICAgICAgIFBvc2VzLkZBQ0VfTUVTSF9DT05ORUNUSU9OU1tpXS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWR4LmFkZCh2WzBdKTtcbiAgICAgICAgICAgICAgICBpZHguYWRkKHZbMV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpZHhBcnIgPSBBcnJheS5mcm9tKGlkeCk7XG4gICAgICAgICAgICB0aGlzLl9mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0LnB1c2goaWR4QXJyKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaWR4QXJyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLmZhY2VMYW5kbWFya3NbaWR4QXJyW2pdXS5wb3MueCxcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy5mYWNlTGFuZG1hcmtzW2lkeEFycltqXV0ucG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHo6IHRoaXMuZmFjZUxhbmRtYXJrc1tpZHhBcnJbal1dLnBvcy54LFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiB0aGlzLmZhY2VMYW5kbWFya3NbaWR4QXJyW2pdXS52aXNpYmlsaXR5LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZmFjZU1lc2hMYW5kbWFya0xpc3QucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsUkxpbmtXZWlnaHRzKCkge1xuICAgICAgICBjb25zdCBmYWNlQ2FtZXJhQW5nbGUgPSBkZWdyZWVCZXR3ZWVuVmVjdG9ycyhcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yKHRoaXMuZmFjZU5vcm1hbCksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHdlaWdodExlZnQgPSByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgIGZhY2VDYW1lcmFBbmdsZS55LFxuICAgICAgICAgICAgUG9zZXMuTFJfRkFDRV9ESVJFQ1RJT05fUkFOR0UsXG4gICAgICAgICAgICAtUG9zZXMuTFJfRkFDRV9ESVJFQ1RJT05fUkFOR0UsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBjb25zdCB3ZWlnaHRSaWdodCA9IHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgZmFjZUNhbWVyYUFuZ2xlLnksXG4gICAgICAgICAgICAtUG9zZXMuTFJfRkFDRV9ESVJFQ1RJT05fUkFOR0UsXG4gICAgICAgICAgICBQb3Nlcy5MUl9GQUNFX0RJUkVDVElPTl9SQU5HRSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7IHdlaWdodExlZnQsIHdlaWdodFJpZ2h0IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsUkxpbmsobDogbnVtYmVyLCByOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgeyB3ZWlnaHRMZWZ0LCB3ZWlnaHRSaWdodCB9ID0gdGhpcy5sUkxpbmtXZWlnaHRzKCk7XG4gICAgICAgIHJldHVybiB3ZWlnaHRMZWZ0ICogbCArIHdlaWdodFJpZ2h0ICogcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxSTGlua1ZlY3RvcihsOiBWZWN0b3IzLCByOiBWZWN0b3IzKSB7XG4gICAgICAgIGNvbnN0IHsgd2VpZ2h0TGVmdCwgd2VpZ2h0UmlnaHQgfSA9IHRoaXMubFJMaW5rV2VpZ2h0cygpO1xuICAgICAgICByZXR1cm4gbC5zY2FsZSh3ZWlnaHRMZWZ0KS5hZGRJblBsYWNlKHIuc2NhbGUod2VpZ2h0UmlnaHQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxSTGlua1F1YXRlcm5pb24obDogUXVhdGVybmlvbiwgcjogUXVhdGVybmlvbikge1xuICAgICAgICBjb25zdCB7IHdlaWdodExlZnQsIHdlaWdodFJpZ2h0IH0gPSB0aGlzLmxSTGlua1dlaWdodHMoKTtcbiAgICAgICAgcmV0dXJuIGwuc2NhbGUod2VpZ2h0TGVmdCkuYWRkSW5QbGFjZShyLnNjYWxlKHdlaWdodFJpZ2h0KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0SGFuZEJvbmVSb3RhdGlvbnMoaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgICAgIC8vIFRPRE86IGFkanVzdCBiYXNlc1xuICAgICAgICAvLyBXcmlzdCdzIGJhc2lzIGlzIHVzZWQgZm9yIGNhbGN1bGF0aW5nIHF1YXRlcm5pb24gYmV0d2VlbiB0d28gQ2FydGVzaWFuIGNvb3JkaW5hdGUgc3lzdGVtcyBkaXJlY3RseVxuICAgICAgICAvLyBBbGwgb3RoZXJzJyBhcmUgdXNlZCBmb3Igcm90YXRpbmcgcGxhbmVzIG9mIGEgU3BoZXJpY2FsIGNvb3JkaW5hdGUgc3lzdGVtIGF0IHRoZSBub2RlXG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1xuICAgICAgICAgICAgaGFuZExhbmRNYXJrVG9Cb25lTmFtZShIQU5EX0xBTkRNQVJLUy5XUklTVCwgaXNMZWZ0KVxuICAgICAgICBdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBpc0xlZnRcbiAgICAgICAgICAgICAgICA/IGdldEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMSksXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgIDogbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuOTMyNzE1OTA3OTU2ODA0MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMC4xMjI4MjUyMjYxNTY1NDM4MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuMzM5MDUwMTQyMTA4NjY4NVxuICAgICAgICAgICAgICAgICAgICAgICkubm9ybWFsaXplKCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC0wLjAxMDAwMjIxMjY3NzA3NzE4MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wMDI0NzI3NjQzNDUzODIyOTQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAyODQxMTU1MTkyNzc0NzMyN1xuICAgICAgICAgICAgICAgICAgICAgICkubm9ybWFsaXplKCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDAuMTQzMjA4MDE0MTExMTI4NTcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDAuOTg5MDQ5NzkyNjk0OTA0OCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuMDM1NjY0NzIwMTY1OTA5ODRcbiAgICAgICAgICAgICAgICAgICAgICApLm5vcm1hbGl6ZSgpLFxuICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgICAgLy8gVGh1bWJcbiAgICAgICAgLy8gVEhVTUJfQ01DXG4gICAgICAgIC8vIFRIVU1CX01DUFxuICAgICAgICAvLyBUSFVNQl9JUFxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdE1DUF9YID0gbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAtMS41KS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IHRNQ1BfWSA9IG5ldyBWZWN0b3IzKDAsIGlzTGVmdCA/IC0xIDogMSwgMCk7XG4gICAgICAgICAgICBjb25zdCB0TUNQX1ogPSBWZWN0b3IzLkNyb3NzKHRNQ1BfWCwgdE1DUF9ZKS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2lzID0gbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICB0TUNQX1gsXG4gICAgICAgICAgICAgICAgLy8gbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICB0TUNQX1ksXG4gICAgICAgICAgICAgICAgdE1DUF9aLFxuICAgICAgICAgICAgXSkucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uRnJvbUV1bGVyQW5nbGVzKDAsIDAsIGlzTGVmdCA/IDAuMiA6IC0wLjIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oUXVhdGVybmlvbi5JZGVudGl0eSgpLCBiYXNpcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5kZXhcbiAgICAgICAgZm9yIChsZXQgaSA9IDU7IGkgPCA4OyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW2hhbmRMYW5kTWFya1RvQm9uZU5hbWUoaSwgaXNMZWZ0KV0gPVxuICAgICAgICAgICAgICAgIG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWlkZGxlXG4gICAgICAgIGZvciAobGV0IGkgPSA5OyBpIDwgMTI7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSaW5nXG4gICAgICAgIGZvciAobGV0IGkgPSAxMzsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW2hhbmRMYW5kTWFya1RvQm9uZU5hbWUoaSwgaXNMZWZ0KV0gPVxuICAgICAgICAgICAgICAgIG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUGlua3lcbiAgICAgICAgZm9yIChsZXQgaSA9IDE3OyBpIDwgMjA7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdEJvbmVSb3RhdGlvbnMoKSB7XG4gICAgICAgIC8vIEhhbmQgYm9uZXNcbiAgICAgICAgdGhpcy5pbml0SGFuZEJvbmVSb3RhdGlvbnModHJ1ZSk7XG4gICAgICAgIHRoaXMuaW5pdEhhbmRCb25lUm90YXRpb25zKGZhbHNlKTtcblxuICAgICAgICAvLyBQb3NlIGJvbmVzXG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiaGVhZFwiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wibmVja1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiaGlwc1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJzcGluZVwiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBsciA9IFtcImxlZnRcIiwgXCJyaWdodFwiXTtcbiAgICAgICAgLy8gQXJtc1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgbHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbYCR7a31VcHBlckFybWBdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgMCwgaXNMZWZ0ID8gMS4wNDcyIDogLTEuMDQ3MiksXG4gICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfUxvd2VyQXJtYF0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGVnc1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgbHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbYCR7a31VcHBlckxlZ2BdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIC0xLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgXSkucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMZWZ0ID8gLTAuMDUyMzYgOiAwLjA1MjM2XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbYCR7a31Mb3dlckxlZ2BdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIC0xLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgXSkucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcygwLCAwLCBpc0xlZnQgPyAtMC4wODczIDogMC4wODczKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmVldFxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgbHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRCYXNpcyA9IG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgLTEsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHJYID0gUXVhdGVybmlvbi5Sb3RhdGlvbkF4aXMoc3RhcnRCYXNpcy54LmNsb25lKCksIGlzTGVmdCA/IDAuMjYxOCA6IC0wLjI2MTgpO1xuICAgICAgICAgICAgLy8gY29uc3QgejEgPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgICAgIC8vIHN0YXJ0QmFzaXMuei5yb3RhdGVCeVF1YXRlcm5pb25Ub1JlZihyWCwgejEpO1xuICAgICAgICAgICAgLy8gY29uc3QgclogPSBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyh6MSwgaXNMZWZ0ID8gMC4wODczIDogLTAuMDg3Myk7XG4gICAgICAgICAgICAvLyBjb25zdCB0aGlzRm9vdEJhc2lzUm90YXRpb24gPSBpc0xlZnQgPyB0aGlzLmxlZnRGb290QmFzaXNSb3RhdGlvbiA6IHRoaXMucmlnaHRGb290QmFzaXNSb3RhdGlvbjtcbiAgICAgICAgICAgIC8vIHRoaXNGb290QmFzaXNSb3RhdGlvbi5jb3B5RnJvbShyWC5tdWx0aXBseShyWikpO1xuXG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfUZvb3RgXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICBzdGFydEJhc2lzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhwcmVzc2lvbnNcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJtb3V0aFwiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiYmxpbmtcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcImxlZnRJcmlzXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJyaWdodElyaXNcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcImlyaXNcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEZyZWV6ZSBpbml0IG9iamVjdFxuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuX2luaXRCb25lUm90YXRpb25zKTtcblxuICAgICAgICAvLyBEZWVwIGNvcHkgdG8gYWN0dWFsIG1hcFxuICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyh0aGlzLl9pbml0Qm9uZVJvdGF0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNba10gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKHYpLFxuICAgICAgICAgICAgICAgIHYuYmFzZUJhc2lzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbm9ybWFsRnJvbVZlcnRpY2VzKFxuICAgICAgICB2ZXJ0aWNlczogRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjMsXG4gICAgICAgIHJldmVyc2U6IGJvb2xlYW5cbiAgICApOiBWZWN0b3IzIHtcbiAgICAgICAgaWYgKHJldmVyc2UpIHZlcnRpY2VzLnJldmVyc2UoKTtcbiAgICAgICAgY29uc3QgdmVjID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgKytpKSB7XG4gICAgICAgICAgICB2ZWMucHVzaCh2ZXJ0aWNlc1tpICsgMV0ucG9zLnN1YnRyYWN0KHZlcnRpY2VzW2ldLnBvcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZWNbMF0uY3Jvc3ModmVjWzFdKS5ub3JtYWxpemUoKTtcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSBhcHBseSBwcmV2aW91cyBxdWF0ZXJuaW9ucyB0byBjdXJyZW50IGJhc2lzXG4gICAgcHJpdmF0ZSBhcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgc3RhcnRMYW5kbWFyazogbnVtYmVyIHwgc3RyaW5nLFxuICAgICAgICBpc0xlZnQ6IGJvb2xlYW5cbiAgICApOiBRdWF0ZXJuaW9uIHtcbiAgICAgICAgY29uc3QgcSA9IFF1YXRlcm5pb24uSWRlbnRpdHkoKTtcbiAgICAgICAgY29uc3Qgcm90YXRpb25zOiBRdWF0ZXJuaW9uW10gPSBbXTtcbiAgICAgICAgbGV0IFtzdGFydE5vZGUsIHBhcmVudE1hcF06IFtcbiAgICAgICAgICAgIFRyYW5zZm9ybU5vZGVUcmVlTm9kZSxcbiAgICAgICAgICAgIE1hcDxUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUsIFRyYW5zZm9ybU5vZGVUcmVlTm9kZT5cbiAgICAgICAgXSA9IGRlcHRoRmlyc3RTZWFyY2goXG4gICAgICAgICAgICB0aGlzLmJvbmVzSGllcmFyY2h5VHJlZSxcbiAgICAgICAgICAgIChuOiBUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gTnVtYmVyLmlzRmluaXRlKHN0YXJ0TGFuZG1hcmspXG4gICAgICAgICAgICAgICAgICAgID8gaGFuZExhbmRNYXJrVG9Cb25lTmFtZShzdGFydExhbmRtYXJrIGFzIG51bWJlciwgaXNMZWZ0KVxuICAgICAgICAgICAgICAgICAgICA6IHN0YXJ0TGFuZG1hcms7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gdGFyZ2V0TmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgd2hpbGUgKHBhcmVudE1hcC5oYXMoc3RhcnROb2RlKSkge1xuICAgICAgICAgICAgc3RhcnROb2RlID0gcGFyZW50TWFwLmdldChzdGFydE5vZGUpITtcbiAgICAgICAgICAgIGNvbnN0IGJvbmVRdWF0ZXJuaW9uID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tzdGFydE5vZGUubmFtZV07XG4gICAgICAgICAgICByb3RhdGlvbnMucHVzaChcbiAgICAgICAgICAgICAgICByZXZlcnNlUm90YXRpb24oXG4gICAgICAgICAgICAgICAgICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24oYm9uZVF1YXRlcm5pb24pLFxuICAgICAgICAgICAgICAgICAgICBBWElTLnl6XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBRdWF0ZXJuaW9ucyBuZWVkIHRvIGJlIGFwcGxpZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW5cbiAgICAgICAgcm90YXRpb25zLnJldmVyc2UoKS5tYXAoKHRxOiBRdWF0ZXJuaW9uKSA9PiB7XG4gICAgICAgICAgICBxLm11bHRpcGx5SW5QbGFjZSh0cSk7XG4gICAgICAgIH0pO1xuICAgICAgICBxLm5vcm1hbGl6ZSgpO1xuXG4gICAgICAgIHJldHVybiBxO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hhbGxVcGRhdGVBcm0oaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBvbmx5IHdoZW4gYWxsIGxlZyBsYW5kbWFya3MgYXJlIHZpc2libGVcbiAgICAgICAgY29uc3Qgc2hvdWxkZXJWaXNpbGliaXR5ID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICAgICA/IFBPU0VfTEFORE1BUktTLkxFRlRfU0hPVUxERVJcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLUy5SSUdIVF9TSE9VTERFUlxuICAgICAgICAgICAgXS52aXNpYmlsaXR5IHx8IDA7XG4gICAgICAgIGNvbnN0IHdyaXN0VmlzaWxpYml0eSA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICBpc0xlZnQgPyBQT1NFX0xBTkRNQVJLUy5MRUZUX1dSSVNUIDogUE9TRV9MQU5ETUFSS1MuUklHSFRfV1JJU1RcbiAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwO1xuICAgICAgICByZXR1cm4gIShcbiAgICAgICAgICAgIHNob3VsZGVyVmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRCB8fFxuICAgICAgICAgICAgd3Jpc3RWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaGFsbFVwZGF0ZUxlZ3MoaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBvbmx5IHdoZW4gYWxsIGxlZyBsYW5kbWFya3MgYXJlIHZpc2libGVcbiAgICAgICAgY29uc3Qga25lZVZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0tORUVcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9LTkVFXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3QgYW5rbGVWaXNpbGliaXR5ID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICAgICA/IFBPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9BTktMRVxuICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0FOS0xFXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3QgZm9vdFZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0ZPT1RfSU5ERVhcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9GT09UX0lOREVYXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3QgaGVlbFZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0hFRUxcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9IRUVMXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgcmV0dXJuICEoXG4gICAgICAgICAgICBrbmVlVmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRCB8fFxuICAgICAgICAgICAgYW5rbGVWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEIHx8XG4gICAgICAgICAgICBmb290VmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRCB8fFxuICAgICAgICAgICAgaGVlbFZpc2lsaWJpdHkgPD0gVklTSUJJTElUWV9USFJFU0hPTERcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHB1c2hCb25lUm90YXRpb25CdWZmZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5fYm9uZVJvdGF0aW9uVXBkYXRlRm4pIHJldHVybjtcblxuICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICBjb25zdCBqc29uU3RyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fYm9uZVJvdGF0aW9ucyk7XG4gICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gdGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUoanNvblN0cik7XG4gICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvblVwZGF0ZUZuKFxuICAgICAgICAgICAgQ29tbGluay50cmFuc2ZlcihhcnJheUJ1ZmZlciwgW2FycmF5QnVmZmVyLmJ1ZmZlcl0pXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgcG9zZVdyYXBwZXIgPSB7XG4gICAgcG9zZXM6IFBvc2VzLFxufTtcblxuQ29tbGluay5leHBvc2UocG9zZVdyYXBwZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBQb3NlcztcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gdGhlIHN0YXJ0dXAgZnVuY3Rpb25cbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5cdC8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuXHR2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX21lZGlhcGlwZV9ob2xpc3RpY19ob2xpc3RpY19qcy1ub2RlX21vZHVsZXNfa2FsbWFuanNfbGliX2thbG1hbl9qcy1ub2RlXy1mZjYwNWVcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd29ya2VyL3Bvc2UtcHJvY2Vzc2luZy50c1wiKSkpXG5cdF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG5cdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xufTtcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzIGFuZCBzaWJsaW5nIGNodW5rcyBmb3IgdGhlIGVudHJ5cG9pbnRcbl9fd2VicGFja19yZXF1aXJlX18uayA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi50ZXN0LmNzc1wiO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3MgYW5kIHNpYmxpbmcgY2h1bmtzIGZvciB0aGUgZW50cnlwb2ludFxuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLnRlc3QuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInNyY193b3JrZXJfcG9zZS1wcm9jZXNzaW5nX3RzXCI6IDFcbn07XG5cbi8vIGltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZ1xudmFyIGluc3RhbGxDaHVuayA9IChkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0d2hpbGUoY2h1bmtJZHMubGVuZ3RoKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkcy5wb3AoKV0gPSAxO1xuXHRwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcbn07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbXBvcnRTY3JpcHRzKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3YzZF93ZWJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rdjNkX3dlYlwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gaW5zdGFsbENodW5rO1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwidmFyIG5leHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLng7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19tZWRpYXBpcGVfaG9saXN0aWNfaG9saXN0aWNfanMtbm9kZV9tb2R1bGVzX2thbG1hbmpzX2xpYl9rYWxtYW5fanMtbm9kZV8tZmY2MDVlXCIpLnRoZW4obmV4dCk7XG59OyIsIiIsIi8vIHJ1biBzdGFydHVwXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9