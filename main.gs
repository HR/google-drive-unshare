/**
 * Google Apps Script to completely unshare and change ownership of
 * files/folders with a user
 */

// Enter the email of the user to remove
var userEmail = 'example@gmail.com'
// Leave blank if you want to unshare all folders/files
var folderId
// Whether to make a copy of the folder/files not owned
var copyNotOwned = true

function main () {
  var folder
  if (folderId) {
    // Unshare just the folder (incl. subfolders/files)
    folder = DriveApp.getFolderById(folderId)
    unshareFolder(folder, userEmail, copyNotOwned)
  } else {
    // Unshare all files/folders
    folder = DriveApp.getRootFolder()
    unshareFolder(folder, userEmail, copyNotOwned)    
    // unshareAll(userEmail)
  }

  if (copyNotOwned) {
    copyUnowned(folder, userEmail)
  }
}

function unshareAll (email) {
  var folders = DriveApp.searchFolders("'" + email + "' in writers")
  var files = DriveApp.searchFiles("'" + email + "' in writers")
  while (folders.hasNext()) {
    unshare(folders.next())
    Logger.log(folder.getName())
  }
  while (files.hasNext()) {
    var file = files.next()
    unshare(file, email)
  }
}

function unshareFolder (folder, email, copyUnowned) {
  unshare(folder, email)
  // Unshare all the files in the folder
  var files = folder.getFiles()
  while (files.hasNext()) {
    var file = files.next()
    unshare(file, email)

    if (copyUnowned && file.getOwner().getEmail() === email) {
      // Make a copy of the file
      file.makeCopy(file.getName(), folder)
      Logger.log('Copied file ' + file.getName())
      folder.removeFile(file)
      Logger.log('Removed file ' + file.getName())
    }
  }
  // Unshare all the subfolders
  var folders = folder.getFolders()
  while (folders.hasNext()) {
    unshareFolder(folders.next(), email)
  }
}

function unshare (item, email) {
  try {
    item.removeEditor(email)
    Logger.log('Unshared ' + item.getName())
  } catch (e) {
    Logger.log(e)
  }
}

function copyUnowned (folder, email) {
  if (folder.getOwner().getEmail() === email) {
    var newFolder = folder.createFolder(folder.getName())
    Logger.log('Copied folder ' + folder.getName())
    var files = folder.getFiles()
    while (files.hasNext()) {
      var file = files.next()
      newFolder.addFile(file)
    }
    folder.removeFolder(folder)
    Logger.log('Removed ' + folder.getName())
  }

  var folders = folder.getFolders()
  while (folders.hasNext()) {
    copyUnowned(folders.next(), email)
  }
}
