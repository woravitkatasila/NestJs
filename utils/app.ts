import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as randomstring from 'randomstring';
import {
  PRIVATE_KEY_PATH,
  REFRESHTOKEN_PRIVATE_KEY_PATH,
} from '../constants/config';
// import { TYPE_FILE_ENUM } from '../constants/status';

const userAgent = async (req) => {
  return {
    ip: req.ip,
    headers: JSON.stringify(req.headers),
    user_agent: req.get('user-agent'),
    endpoint: req.path,
  };
};

const schemaValidator = async (data, schema) => {
  try {
    const validated = await schema.validateAsync(data);
    return validated;
  } catch (error) {
    return error;
  }
};

const genPassword = async (password) => {
  const saltRounds = 10;
  const yourPassword = password;
  const genSalt = await bcrypt.genSalt(saltRounds);
  const genPasswd = await bcrypt.hash(yourPassword, genSalt);
  return { genSalt, genPasswd };
};

const verifyPassword = async (password, has) => {
  const verify = await bcrypt.compare(password, has);
  return verify;
};

const genTokenJWT = async (email, isAccess = true) => {
  const token = await jwt.sign(
    { email },
    isAccess ? PRIVATE_KEY_PATH : REFRESHTOKEN_PRIVATE_KEY_PATH,
    {
      expiresIn: isAccess ? '200000' : '1 day',
    },
  );
  return token;
};

const verifyTokenJWT = async (token, isAccess = true) => {
  const verified = await jwt.verify(
    token,
    isAccess ? PRIVATE_KEY_PATH : REFRESHTOKEN_PRIVATE_KEY_PATH,
  );
  return verified;
};

const uploadFiles = async (folder, files) => {
  try {
    const file_dir = `public/files/${folder}`,
      result = [];

    if (!fs.existsSync(file_dir)) fs.mkdirSync(file_dir, { recursive: true });

    await Promise.all(
      files.map(async (file) => {
        const { fieldname, originalname, mimetype, buffer, size } = file,
          dir_type = mimetype.includes('image') ? 'images' : 'docs',
          file_dir_type = `${file_dir}/${dir_type}`;

        if (!fs.existsSync(file_dir_type)) fs.mkdirSync(file_dir_type);
        // const fileEx = originalname.split('.').slice(-1).pop();
        // path = `${file_dir_type}/${name}.${fileEx}`;
        // const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        let path = `${file_dir_type}/${originalname}`;
        let fileName = '';

        if (fs.existsSync(path)) {
          fs.readdirSync(file_dir_type).forEach((file) => {
            if (file === originalname) {
              let count = 1;
              fs.readdirSync(file_dir_type).forEach((fileDup) => {
                if (fileDup.split('(')[0] === originalname.split('.')[0])
                  count++;
              });

              fileName = `${originalname.split('.')[0]}(${count}).${
                originalname.split('.')[1]
              }`;
              path = `${file_dir_type}/${fileName}`;
            }
          });
        }

        fs.writeFileSync(path, buffer);
        result.push({
          fieldname,
          fileExtension: mimetype,
          fileName,
          fileSize: size,
          path,
        });
      }),
    );

    return result;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const genAccountCode = async () => {
  const code = await randomstring.generate({
    length: 10,
    charset: 'alphanumeric',
  });
  return code;
};

export {
  userAgent,
  schemaValidator,
  genPassword,
  verifyPassword,
  genTokenJWT,
  verifyTokenJWT,
  uploadFiles,
  genAccountCode,
};
