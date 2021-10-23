import React, { ReactElement, useCallback } from 'react'
import MuiStepper from '@material-ui/core/Stepper'
import MuiStepButton from '@material-ui/core/StepButton'
import MuiStepLabel from '@material-ui/core/StepLabel'
import MuiStep from '@material-ui/core/Step'
import MuiStepConnector from '@material-ui/core/StepConnector'
import { makeStyles, withStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { ReactComponent as StepCompletedIcon } from 'assets/componentsIcon/step_completed_icon.svg'

interface Props {
  activeStep: number
  steps: number[]
  completedIcon?: React.ReactNode
  connector?: ReactElement
  onStep?: (step: number) => void
}

const Connector = withStyles({
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient(90deg, #24FF00 0%, #FFFFFF 100%)'
    }
  },
  completed: {
    '& $line': {
      backgroundImage: 'linear-gradient(90deg, #24FF00 0%, #FFFFFF 100%)'
    }
  },
  line: {
    background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.4) 100%)',
    height: 1,
    width: '100%',
    border: 0,
    borderRadius: 1
  }
})(MuiStepConnector)

const useStyles = makeStyles({
  root: {
    background: 'transparent',
    padding: 0
  },
  icon: {
    borderRadius: '50%',
    border: '1px solid #FFFFFF',
    opacity: 0.4,
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    opacity: 1
  },
  completed: {
    color: 'transparent !important'
  },
  text: {
    color: 'white !important'
  },
  button: {
    '&.Mui-disabled': {
      cursor: 'pointer',
      pointerEvents: 'auto'
    }
  },
  label: {
    '&.Mui-disabled': {
      cursor: 'pointer',
      pointerEvents: 'auto',
      userSelect: 'all'
    }
  }
})

export default function Stepper(props: Props) {
  const { activeStep, steps, completedIcon = <StepCompletedIcon />, connector = <Connector />, onStep } = props
  const classes = useStyles(props)

  const onClick = useCallback(e => onStep && onStep(parseInt(e.currentTarget.value)), [onStep])

  return (
    <MuiStepper nonLinear classes={{ root: classes.root }} activeStep={activeStep} connector={connector}>
      {steps.map((label, index) => {
        return (
          <MuiStep key={label}>
            <MuiStepButton className={classes.button} onClick={onClick} value={index}>
              <MuiStepLabel
                disabled
                className={classes.label}
                StepIconProps={{
                  classes: {
                    root: classes.icon,
                    active: classes.active,
                    completed: classes.completed,
                    text: classes.text
                  },
                  completed: index < activeStep,
                  icon: (
                    <>
                      {index < activeStep ? (
                        completedIcon
                      ) : (
                        <div
                          className={clsx(classes.icon, {
                            [classes.active]: index === activeStep
                          })}
                        >
                          {label}
                        </div>
                      )}
                    </>
                  )
                }}
              />
            </MuiStepButton>
          </MuiStep>
        )
      })}
    </MuiStepper>
  )
}
