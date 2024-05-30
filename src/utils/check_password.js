import bcrypt from "bcrypt"


const minPasswordLen = 6;
const maxPasswordLen = 13;

export const passwordCritera = function (password) {
  if (password.length < minPasswordLen || password.length > maxPasswordLen) {
    if (password.length < minPasswordLen) {
      return {
        success: false,
        error: "Password should contain atleast 6 charcters",
      };
    } else {
      return {
        success: false,
        error: "Password must not be greater than 13 characters",
      };
    }
  }

  return { success: true };
};



export const HashPassword = async function(password){
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}