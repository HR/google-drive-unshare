/**
 * Google Apps Script to completely unshare files/folders with someone and make
 * a copy of them 
 */

// Enter the email of the user to remove
var userEmail = 'example@gmail.com'
// Leave blank if you want to unshare all folders/files
var folderId
// Whether to make a copy of the folder/files not owned
var copyNotOwned = false

function main () {
  var folder
  if (folderId) {
    // Unshare just the folder (incl. subfolders/files)
    folder = DriveApp.getFolderById(folderId)
    unshareItems(folder, userEmail)
  } else {
    // Unshare all files/folders
    folder = DriveApp.getRootFolder()
    unshareItems(folder, userEmail)
  }

  if (copyNotOwned) {
    copyUnownedItems(folder, userEmail)
  }
}

function unshareItems (folder, email) {
  unshare(folder, email)
  // Unshare all the files in the folder
  var files = folder.searchFiles("'" + email + "' in writers")
  while (files.hasNext()) {
    unshare(files.next(), email)
  }
  // Unshare all the subfolders
  var folders = folder.searchFolders("'" + email + "' in writers")
  while (folders.hasNext()) {
    unshare(folders.next(), email)
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

function copyUnownedItems (folder, email) {
  // Copy unowned files
  var files = folder.searchFiles("'" + email + "' in owners")
  while (files.hasNext()) {
    let file = files.next()
    // Make a copy of the file
    let parent = file.getParent().next()
    file.makeCopy(file.getName(), parent)
    Logger.log('Copied unowned file ' + file.getName())
    parent.removeFile(file)
    Logger.log('Removed unowned file ' + file.getName())
  }
  // Copy unowned folders (incl. the files therein)
  var folders = folder.searchFolders("'" + email + "' in owners")
  while (folders.hasNext()) {
    let unownedFolder = folders.next()
    let parent = unownedFolder.getParent().next()

    let ownedFolder = parent.createFolder(unownedFolder.getName())
    Logger.log('Copied unowned folder ' + unownedFolder.getName())

    // Copu unowned folder files
    let folderFiles = unownedFolder.getFiles()
    while (folderFiles.hasNext()) {
      ownedFolder.addFile(folderFiles.next())
    }
    // Copu unowned folder subfolders
    let folderFolders = unownedFolder.getFolders()
    while (folderFolders.hasNext()) {
      ownedFolder.addFile(folderFolders.next())
    }
    
    parent.removeFolder(unownedFolder)
    Logger.log('Removed unowned folder ' + unownedFolder.getName())
  }
}
