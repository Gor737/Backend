const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        minLength(value) {
          if (value.length < 6)
            throw new Error("Password must be at least 6 characters");
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "instructor", "student"),
      defaultValue: "student",
    },
  },
  {
    timestamps: true,
    attributes: {
        exclude: ['password']
    }
  },
);

module.exports = User;
