# Google Drive Unshare
Google Apps Script to unshare files and folders with someone and make a copy of
them.

# Features

- Unshare all files and folders with everyone.
- Unshare all files and folders with someone.
- Unshare a folder (incl. subfiles and subfolders) with everyone.
- Unshare a folder (incl. subfiles and subfolders) with someone.
- Transfer ownership: copy all files and folders owned by someone while
  unsharing them with that someone becoming the owner of them.

# Installation & Usage

> ⚠️ Leaving both `userEmail` and `folderId` blank will unshare everthing in your Drive with everyone

1. Go to https://script.google.com/start and make sure you're signed in with the
   Google Drive account you want to use for this.
2. Copy & Paste the `Code.gs` in this repository into the default file and
   select the `main` function under "Select function"
3. In the code, set the `userEmail` variable to the email address of the user
   you want unshare items with or leave it blank to unshare with everyone and
   optionally set `copyNotOwned` variable to `true` if you want to also copy the
   items. If you want to unshare a specific folder (incl. subfolders and
   subfiles), set the `folderId` variable (everything after
   https://drive.google.com/drive/folders/ of the folder URL).
4. Hit run! (You will probably also be prompted grant permission to your drive
   so do that)

<p align="center">
  <img src=".github/permissions.png?raw=true" width="40%">
  <img src=".github/permissions_allow.png?raw=true" width="40%">
</p>
