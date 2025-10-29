"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.UserRole = void 0;
// src/utils/enums.ts
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Resident"] = "resident";
    UserRole["Committee"] = "committee";
    UserRole["Security"] = "security";
    UserRole["Technician"] = "technician";
})(UserRole || (exports.UserRole = UserRole = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender || (exports.Gender = Gender = {}));
//# sourceMappingURL=enums.js.map