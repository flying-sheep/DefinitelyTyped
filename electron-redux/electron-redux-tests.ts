/// <reference types="node" />


  ////////////////////
 // in both stores //
////////////////////


import { combineReducers, createStore, applyMiddleware } from 'redux'
const reducers: Redux.ReducersMapObject = require('../reducers')

const otherMiddleware: Redux.Middleware[] = [ /* … */ ]


  ///////////////////////
 // in the main store //
///////////////////////


import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux'

{
	const initialState = require('../initial-state.json')
	
	const todoApp = combineReducers(reducers)

	const store = createStore(
		todoApp,
		initialState, // optional
		applyMiddleware(
			triggerAlias, // optional, see below
			...otherMiddleware,
			forwardToRenderer, // IMPORTANT! This goes last
		),
	)

	replayActionMain(store)
}

  ///////////////////////////
 // in the renderer store //
///////////////////////////


import {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
} from 'electron-redux'

{
	const todoApp = combineReducers(reducers)
	const initialState = getInitialStateRenderer()

	const store = createStore(
		todoApp,
		initialState,
		applyMiddleware(
			forwardToMain, // IMPORTANT! This goes first
			...otherMiddleware,
		),
	)

	replayActionRenderer(store)
}


  ////////////////////////////////////
 // aliased actions (main process) //
////////////////////////////////////


import { createAliasedAction } from 'electron-redux'
const importProjects: (accessToken: string, repoFullName: string) => Promise<any[]> = require('../../main/api/importProjects')

export const IMPORT_GITHUB_PROJECTS = 'IMPORT_GITHUB_PROJECTS'
export const importGithubProjects = createAliasedAction(
  IMPORT_GITHUB_PROJECTS, // unique identifier
  (accessToken, repoFullName) => ({
    type: IMPORT_GITHUB_PROJECTS,
    payload: importProjects(accessToken, repoFullName),
  })
)
