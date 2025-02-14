/*
  Copyright (c) Microsoft Corporation.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import type { HTMLReport, TestCase } from '@playwright/test/src/reporters/html';
import * as React from 'react';
import { TabbedPane } from './tabbedPane';
import { Chip } from './chip';
import './common.css';
import { ProjectLink } from './links';
import { statusIcon } from './statusIcon';
import './testCaseView.css';
import { TestResultView } from './testResultView';

export const TestCaseView: React.FC<{
  report: HTMLReport,
  test: TestCase | undefined,
}> = ({ report, test }) => {
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(0);

  return <div className='test-case-column vbox'>
    {test && <div className='test-case-path'>{test.path.join(' › ')}</div>}
    {test && <div className='test-case-title'>{test?.title}</div>}
    {test && <div className='test-case-location'>{test.location.file}:{test.location.line}</div>}
    {test && !!test.projectName && <ProjectLink report={report} projectName={test.projectName}></ProjectLink>}
    {test && !!test.annotations.length && <Chip header='Annotations'>
      {test.annotations.map(a => <div className='test-case-annotation'>
        <span style={{ fontWeight: 'bold' }}>{a.type}</span>
        {a.description && <span>: {a.description}</span>}
      </div>)}
    </Chip>}
    {test && <TabbedPane tabs={
      test.results.map((result, index) => ({
        id: String(index),
        title: <div style={{ display: 'flex', alignItems: 'center' }}>{statusIcon(result.status)} {retryLabel(index)}</div>,
        render: () => <TestResultView test={test!} result={result}></TestResultView>
      })) || []} selectedTab={String(selectedResultIndex)} setSelectedTab={id => setSelectedResultIndex(+id)} />}
  </div>;
};

function retryLabel(index: number) {
  if (!index)
    return 'Run';
  return `Retry #${index}`;
}
