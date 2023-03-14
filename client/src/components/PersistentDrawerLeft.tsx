import {
  AppBar,
  CssBaseline,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Link, useLocation } from "wouter";
import clsx from "clsx";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft(props: any) {
  const classes = useStyles();
  const [location] = useLocation();
  const matches = useMediaQuery("(max-width: 768px)");

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
      >
        <Toolbar style={{ paddingRight: matches ? 8 : 10 }}>
          {(
            <>
              {matches ? (
                <Typography
                  variant="h6"
                  noWrap
                  style={{ flexGrow: 1, cursor: "pointer" }}
                >
                  {location === "/"
                    ? "TODOS"
                    : location.toUpperCase().replace("/", "")}
                </Typography>
              ) : (
                <Link href="/">
                  <Typography
                    variant="h6"
                    noWrap
                    style={{ flexGrow: 1, cursor: "pointer" }}
                  >
                    TODOS
                  </Typography>
                </Link>
              )}

            </>
          )}
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: false,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}
