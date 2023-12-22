import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import React from "react";
import { Button } from "react-native";

function NewFileActionSheet() {
    sheetId = "NewFileActionSheet";
    return (
      <ActionSheet id={sheetId}>
        <Button
        title="New Set"
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "NewSet",
            });
        }}
        />
        <Button
        title="New Folder"
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "NewFolder",
            });
        }}
        />
        <Button
        title="Cancel"
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "Cancel",
            });
        }}
        />
      </ActionSheet>
    );
  }
   
  export default NewFileActionSheet;