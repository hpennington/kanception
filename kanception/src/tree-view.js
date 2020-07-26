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
    <SvgIcon onClick={props.onClick} className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
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

const TreeContextMenu = props => {
  const style = {
    //visibility: props.isOpen === true ? 'visible' : 'hidden',
    //top: props.position.y, left: props.position.x,
    zIndex: 10,
    textAlign: 'center',
  }

  const onContextMenu = e => {
    e.preventDefault()
    props.onClose(e)
  }

  return (
    <div
      data-card-id={props.cardId}
      className="context-menu"
      style={style}
      onContextMenu={onContextMenu}
    >
      <h6 onClick={props.onDelete} className="border-bottom">Delete Project</h6>
      <h6 onClick={props.onClose} className="border-top">Close</h6>
    </div>
  )
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
    marginLeft: 0,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => <TreeItem {...props} />);

const useStyles = makeStyles({
  root: {
    height: "fit-content",
    flexGrow: 1,
    maxWidth: 400,
    width: '200px',
  },
});

export default function CustomizedTreeView(props) {
  const classes = useStyles();
  const [projectTitleMenuOpen, setProjectTitleMenuOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextProject, setContextProject] = useState(null)

  const onNodeSelect = (event, value) => {
    // If project selected
    if (props.projects.find(project => project._id === value) != null) {
      props.setSelectedProject(value, event.target.nodeId)
      console.log(event.target.className)
      if (event.target.className?.baseVal?.includes('MuiSvgIcon-root') === true
        || event.target.className?.baseVal === ''
        || event.target.className.includes('close')
        || (event.target.className.includes('Mui')
          && !event.target.className.includes('MuiTypography-root'))
      ) {
        event.preventDefault()
        event.stopPropagation()
        //console.log('Delete project')
        //const projectName = window.prompt('Type the project name to delete:')
        // console.log(projectName)
      } else if (event.target.className.includes('MuiTypography-root') === true) {
        console.log(event.target.parentElement.parentElement)
        props.setSelectedTeam(event.target.parentElement.parentElement.dataset.spaceId)
      } else {
        console.log(event.target.parentElement.parentElement.parentElement)
        props.setSelectedTeam(event.target.parentElement.parentElement.dataset.spaceId)
      }

    } else if (props.spaces.find(space => space._id === value) != null) {
      props.setSelectedTeam(value)
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

  const onDeleteProject = e => {
    setContextMenuOpen(false)
    const projectName = window.prompt('Type project name to confirm delete')
    console.log(contextProject)
    if (projectName === props.projects.find(p => p._id === contextProject).title) {
      console.log(projectName)
      props.onDeleteProject(contextProject)
    }
  }

  const onContextClick = e => {
    e.preventDefault()
    setContextMenuOpen(!contextMenuOpen)
    setContextProject(e.target.parentNode.parentNode.dataset.nodeId)
  }

  return (
    <div
      style={{
        marginRight: "20px",
        marginLeft: "20px",
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
        onNodeSelect={onNodeSelect}
        expanded={props.spaces.map(space => space._id)}
        selected={props.selectedProject != null ? props.selectedProject : props.selectedTeam}
      >
        {
        contextMenuOpen === true &&
        <TreeContextMenu
          onDelete={onDeleteProject}
          onClose={e => setContextMenuOpen(false)}
        />
        }
        {
        props.spaces.map(
          space =>
          <StyledTreeItem nodeId={space._id} label={space.title}>
            <StyledTreeItem
              data-space-id={space._id}
              nodeId={space._id + '-add'}
              label={<span><strong style={{color: "rebeccapurple"}}>New +</strong></span>}
            />
            {
            props.projects.filter(project => project.space === space._id)
            .map(project =>
              <StyledTreeItem data-space-id={space._id}
                onContextMenu={onContextClick}
                data-node-id={project._id}
                nodeId={project._id} label={project.title} />
              )
            }
          </StyledTreeItem>
        )
        }
      </TreeView>
    </div>
  );
}
