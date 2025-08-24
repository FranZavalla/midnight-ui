// 'use client';
// import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
// import { useCallback, useEffect, useState } from 'react';
// import { Observable } from 'rxjs';
// import { BoardDeployment } from '../contexts';
// import { useDeployedContractContext } from '../hooks';
// import { Button } from './Button';
// import { Show } from './Show';

// export const CreateAlgo = () => {
//   const counterApiProvider = useDeployedContractContext();
//   const onCreateContract = useCallback(() => counterApiProvider.resolve(), [counterApiProvider]);
//   const onJoinContract = useCallback(
//     (contractAddress: ContractAddress) => {
//       counterApiProvider.resolve(contractAddress);
//     },
//     [counterApiProvider],
//   );

//   const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);

//   useEffect(() => {
//     const subscription = counterApiProvider.boardDeployments$.subscribe(setBoardDeployments);

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [counterApiProvider]);

//   return (
//     <div>
//       <Button onClick={onCreateContract}>CREATE ALGO</Button>
//       <div>
//         {boardDeployments.map((deploy, id) => (
//           <div data-testid={`board-${id}`} key={`board-${id}`}>
//             <Show deploy={deploy} />
//           </div>
//         ))}
//       </div>
//       <Button onClick={() => onJoinContract('02020005b60f8767b1c29c8fc615e336cc19bfe1cad5153a821c6d77c0f8b6d6dcf218')}>
//         JOIN
//       </Button>
//       <div>
//         {boardDeployments.map((deploy, id) => (
//           <div data-testid={`board-${id}`} key={`board-${id}`}>
//             <Show deploy={deploy} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
