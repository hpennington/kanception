import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs';
import { ProjectTitleMenu } from './menu'

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon onClick={e => e.preventDefault()} className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

const useStyles = makeStyles({
  root: {
    height: "fit-content",
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function CustomizedTreeView(props) {
  const classes = useStyles();
  const [projectTitleMenuOpen, setProjectTitleMenuOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)

  const onNodeSelect = (event, value) => {
    // If project selected
    if (props.projects.find(project => project._id === value) != null) {
      props.setSelectedProject(value)

    } else if (props.spaces.find(space => space._id === value) != null) {

    } else if (value.includes('add') === true) {
      onAddProject(value.replace('-add', ''))
    }
  }

  const onAddProject = value => {
    console.log(value)
    setSelectedSpace(value)
    setProjectTitleMenuOpen(true)
  }

  const onProjectSave = title => {
    console.log(title)
    setProjectTitleMenuOpen(false)
    props.onAddProject(title, selectedSpace)
  }

  const onClose = e => {
    setProjectTitleMenuOpen(false)
  }

  return (
    <div
      style={{
        marginRight: "45px",
        marginLeft: "45px",
      }}
    >
      {
      projectTitleMenuOpen === true &&
      <ProjectTitleMenu
        onSave={onProjectSave}
        close={onClose}
      />
      }
      <TreeView
        className={classes.root}
        defaultExpanded={['1']}
        defaultSelected={"2"}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        onNodeSelect={onNodeSelect}
        expanded={props.spaces.map(space => space._id)}
      >
        {
        props.spaces.map(
          space =>
          <StyledTreeItem nodeId={space._id} label={space.title}>
            <StyledTreeItem
              data-node-id={space._id}
              nodeId={space._id + '-add'}
              label={<strong data-node-id={space._id}>New</strong>}
            />
            {
            props.projects.filter(project => project.space === space._id)
              .map(project =>
              <StyledTreeItem nodeId={project._id} label={project.title} />
              )
            }
          </StyledTreeItem>
        )
        }
      </TreeView>
    </div>
  );
}