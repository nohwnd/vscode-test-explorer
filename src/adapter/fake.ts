import { Observable, Subject } from 'rxjs';
import { TestRunnerAdapter, TestSuite, Test, TestState } from './api';

export class FakeAdapter implements TestRunnerAdapter {

	private readonly testsSubject = new Subject<TestSuite>();
	private readonly statesSubject = new Subject<TestState>();

	private readonly tree: TestSuite = {
		type: 'suite',
		id: 'root',
		label: 'Root',
		children: [
			<Test> {
				type: 'test',
				id: 'Test1',
				label: 'Test #1'
			},
			<Test> {
				type: 'test',
				id: 'Test2',
				label: 'Test #2'
			},
			<TestSuite> {
				type: 'suite',
				id: 'Suite1',
				label: 'Test Suite',
				children: [
					<Test> {
						type: 'test',
						id: 'Test3',
						label: 'Test #3'
					},
					<Test> {
						type: 'test',
						id: 'Test4',
						label: 'Test #4'
					}
				]
			}
		]
	};

	get tests(): Observable<TestSuite> {
		return this.testsSubject.asObservable();
	}

	get testStates(): Observable<TestState> {
		return this.statesSubject.asObservable();
	}
	
	reloadTests(): void {
		this.testsSubject.next(this.tree);
	}

	async startTests(tests: string[]): Promise<void> {
		let successToggle = true;
		await delay(500);
		for (const testId of tests) {
			this.statesSubject.next({ testId, state: 'running' });
			await delay(1000);
			this.statesSubject.next({ testId, state: successToggle ? 'success' : 'error' });
			successToggle = !successToggle;
			await delay(200);
		}
	}
}

function delay(timeout: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, timeout);
	});
}
