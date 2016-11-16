// Type definitions for electron-redux 1.2.2
// Project: https://github.com/hardchor/electron-redux
// Definitions by: flying-sheep <https://github.com/flying-sheep>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Store, Middleware, ActionCreator } from 'redux'
import { Action, TypedMeta } from 'flux-standard-action'

/** FSA-complying action. If `meta.scope` is set to `local`, it will not propagate from Renderer to Main store */
export interface LocalAction<P> extends Action<P>, TypedMeta<{ scope: 'local' }> {
	meta: {
		/** Action will not propagate from Renderer to Main store */
		scope: 'local'
	}
}

/** An FSA-complying action created by `createAliasedAction`, which will only be executed in the main process, and the result of which is being broadcast to the Renderer processes */
export interface AliasedAction extends Action<any[]>, TypedMeta<{ trigger: string }> {
	type: 'ALIASED'
	/** The arguments passed to the the `actionCreator` argument of `createAliasedAction` */
	payload: any[]
	meta: {
		/** The original action’s `type` */
		trigger: string
	}
}

/** *First* middleware to apply to Renderer store */
export const forwardToMain: Middleware
/** *Last* middleware to apply to Main store */
export const forwardToRenderer: Middleware
/** Apply to Main store if you want to use aliased actions */
export const triggerAlias: Middleware

/** Creates an action that will only be executed in the main process, and the result of which is being broadcast to the Renderer processes */
export function createAliasedAction<P, A extends Action<P>>(name: string, actionCreator: ActionCreator<A>): ActionCreator<AliasedAction>
/** Call on the Main store to make it receive actions sent from the Renderer via `forwardToMain` */
export function replayActionMain<S>(store: Store<S>): void
/** Call on the Renderer store to make it receive actions sent from Main via `forwardToRenderer`  */
export function replayActionRenderer<S>(store: Store<S>): void
/** Returns the `initialState` argument passed to the Main store for use in the Renderer store */
export function getInitialStateRenderer(): any
