import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve('./.env') });
import * as Google from '@google-cloud/storage';
export default class GoogleClass {
    static serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
    static storage = new Google.Storage({ credentials: GoogleClass.serviceAccount, projectId: GoogleClass.serviceAccount['project_id'] });
    static bucket = GoogleClass.storage.bucket('statisticshock_github_io_public');
}
;
