import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
} from "@material-ui/core";
import dayjs from "dayjs";

interface Props {
  yes: (name: string, deadline: string) => void;
  open: boolean;
  close: () => void;
  name: string;
  deadline: string;
}

const EditConfirm = ({ open, close, name, deadline, yes }: Props) => {
  const [newName, setNewName] = useState(name);
  const [newDeadline, setNewDeadline] = useState(deadline);
  const onClose = () => {
    setNewName(name);
    close();
  };
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">EDIT ITEM</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please provide the new name for this item.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New Value"
          type="text"
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <TextField
          id="date"
          label="Deadline"
          type="datetime-local"
          value={dayjs(newDeadline).toISOString().replace('Z', '')}
          style={{ marginTop: 5 }}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => newName.trim() && yes(newName, newDeadline)}
          color="primary"
          variant="contained"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditConfirm;
