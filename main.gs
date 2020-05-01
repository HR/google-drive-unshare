/**
 * Google Script to completely unshare and change ownership of files/folders
 * with a user
 */

// Enter the email of the user to remove
var userEmail = 'example@gmail.com'
// Leave blank if you want to unshare all folders/files
var folderId
// Whether to make a copy of the folder/files owned by the user
var copyUserOwned = true

function main () {
  if (folderId) {
    unshareFolder(folderId, userEmail)
    changeOwner(folderId, userEmail, copyUserOwned)
  } else {
    unshareAll(userEmail)
  }
}

function unshareAll (email) {
  var folders = DriveApp.searchFolders("'" + email + "' in writers")
  var files = DriveApp.searchFiles("'" + email + "' in writers")
  while (folders.hasNext()) {
    unshareFolder(folders.next())
    Logger.log(folder.getName())
  }
  while (files.hasNext()) {
    var file = files.next()
    unshare(file, email)
    Logger.log(file.getName())
  }
}

function changeOwner (folderId, email, makeCopy) {
  var currFolder = DriveApp.getFolderById(folderId)
  var folders = currFolder.getFolders()
  while (folders.hasNext()) {
    var folder = folders.next()
    if (folder.getOwner().getEmail() === email) {
      if (!makeCopy) continue

      Logger.log('Copying folder ' + folder.getName())
      var newFolder = currFolder.createFolder(folder.getName())
      var files = folder.getFiles()
      while (files.hasNext()) {
        var file = files.next()
        newFolder.addFile(file)
      }
      Logger.log('Removing ' + folder.getName())
      currFolder.removeFolder(folder)
      Logger.log('done')
    } else {
      changeOwner(folder.getId(), email)
    }
  }
}

function unshareFolder (folderId, email) {
  var currFolder = DriveApp.getFolderById(folderId)
  unshare(currFolder, email)

  var files = currFolder.getFiles()
  while (files.hasNext()) {
    var file = files.next()
    unshare(file, email)
    if (file.getOwner().getEmail() === email) {
      Logger.log('Copying file ' + file.getName())
      file.makeCopy(file.getName(), currFolder)
      Logger.log('Removing ' + file.getName())
      currFolder.removeFile(file)
    }
  }

  var folders = currFolder.getFolders()
  while (folders.hasNext()) {
    var folder = folders.next()
    unshareFolder(folder.getId(), email)
  }
}

function unshare (file, email) {
  Logger.log('Revoking ' + file.getName())
  try {
    file.removeEditor(email)
  } catch (e) {
    Logger.log(e)
  }
  Logger.log('Done')
}
