import { useState, FC, ChangeEvent } from "react";
import {
  FormControl,
  Container,
  Button,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Add } from "@material-ui/icons";

const AddTodo: FC<{ addTodo: (name: string, deadline: string) => void }> = ({ addTodo }) => {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [open, setOpen] = useState(false);
  const handleNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setName(e.target.value);
  const handleDeadlineChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setDeadline(e.target.value);
  const createTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(name, deadline);
    setName("");
    setDeadline("");
    if (name.trim()) setOpen(true);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <form onSubmit={createTodo} className="add-todo">
          <FormControl fullWidth={true}>
            <TextField
              label="I will do this"
              variant="standard"
              onChange={handleNameChange}
              required={true}
              value={name}
            />
            <TextField
              id="date"
              label="Deadline"
              type="datetime-local"
              required={true}
              style={{ marginTop: 5 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={deadline}
              onChange={handleDeadlineChange}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 5 }}
              type="submit"
            >
              <Add />
              Add
            </Button>
          </FormControl>
        </form>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          // icon={<Check fontSize="inherit" />}
          elevation={6}
          variant="filled"
          onClose={() => setOpen(false)}
          severity="success"
        >
          Successfully added item!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddTodo;
