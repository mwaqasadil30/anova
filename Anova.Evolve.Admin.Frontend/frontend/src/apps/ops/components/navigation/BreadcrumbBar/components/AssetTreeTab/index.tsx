/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { ChevronRight } from '@material-ui/icons';
import { TreeNodeInfo } from 'api/admin/api';
import { ReactComponent as TreeFolder } from 'assets/icons/updated-tree-folder.svg';
import Button from 'components/Button';
import CircularProgress from 'components/CircularProgress';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DomainThemeColor } from 'styles/colours';
import { TabPanel } from '../../helpers';
import { NodeDetails } from '../../hooks/useAssetTreeParentNodeApi';
import { useGetAssetTreeNodeInfoListRootByDomain } from '../../hooks/useGetAssetTreeNodeInfoListRootByDomain';
import { StyledNavMenuItemIcon } from '../../styles';

const StyledTreeFolder = styled(TreeFolder)`
  padding-top: 8px;
  margin-right: 4px;
  color: ${(props) =>
    props.theme.custom.domainColor === DomainThemeColor.Yellow &&
    props.theme.palette.type === 'light'
      ? '#464646'
      : props.theme.custom.domainColor};
`;

const StyledTreeButton = styled(({ depth, selected, ...props }) => (
  <Button {...props} />
))`
  justify-content: flex-start;
  && {
    ${(props) => props.depth > -1 && `padding-left: ${props.depth * 20 + 8}px`};
  }

  ${(props) =>
    props.selected &&
    `
  background-color: rgba(0, 0, 0, 0.08);
  `}
`;

const StyledEmptyTreeFolderIcon = styled(StyledTreeFolder)`
  padding-left: 24px;
`;

const StyledChevron = styled(ChevronRight)`
  font-size: 20px;
`;

const StyledIconButton = styled(IconButton)`
  width: 34px;
  height: 34px;
`;

interface TreeItemProps {
  depth: number;
  node: TreeNodeInfo;
  nodePath: TreeNodeInfo[];
  nodeDetailsMapping: Record<string, NodeDetails>;
  nodeExpandedMapping: Record<string, boolean>;
  selectedNode?: TreeNodeInfo;
  handleToggleExpandTree: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    treeNode: TreeNodeInfo
  ) => void;
  handleClickTreeItem: (nodes: TreeNodeInfo[]) => void;
}

const TreeItem = ({
  depth,
  node,
  nodePath,
  nodeDetailsMapping,
  nodeExpandedMapping,
  handleToggleExpandTree,
  handleClickTreeItem,
  selectedNode,
}: TreeItemProps) => {
  const nodeId = node.breadCrumb;
  const nodeLevel = node.level || 0;
  const nodeLevelTypesLength = node.levelTypes?.split('/').length || 0;
  const nodeDetails = nodeDetailsMapping[nodeId!];
  const isFetching = nodeDetails?.isFetching;
  const children = nodeDetails?.children;
  const isExpanded = nodeExpandedMapping[nodeId!];
  const hasChildren = nodeLevel + 1 < nodeLevelTypesLength;

  return (
    <>
      <StyledTreeButton
        // @ts-ignore
        component="div"
        role="button"
        depth={depth}
        fullWidth
        disableRipple
        onClick={() => handleClickTreeItem(nodePath)}
        selected={node.breadCrumb === selectedNode?.breadCrumb}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <StyledIconButton
              onClick={(event: any) => {
                handleToggleExpandTree(event, node);
              }}
              style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
              aria-label="Toggle asset tree item expand"
              aria-hidden={!hasChildren}
            >
              {isFetching ? (
                <Box width={16}>
                  <CircularProgress size={16} />
                </Box>
              ) : isExpanded ? (
                <StyledChevron
                  style={{
                    transform: 'rotate(90deg)',
                  }}
                />
              ) : (
                <StyledChevron />
              )}
            </StyledIconButton>
          </Grid>
          <Grid item>
            <StyledNavMenuItemIcon as={StyledTreeFolder} />
          </Grid>

          <Grid
            item
            xs
            title={node.name ? node.name : ''}
            aria-label="Asset tree item title"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {node.name}
          </Grid>
        </Grid>
      </StyledTreeButton>
      {isExpanded && children && children.length > 0 && (
        <Collapse in timeout="auto" unmountOnExit>
          <List component="nav" disablePadding>
            {children.map((child) => {
              return (
                <TreeItem
                  key={child.breadCrumb!}
                  depth={depth + 1}
                  node={child}
                  nodePath={[...nodePath, child]}
                  nodeDetailsMapping={nodeDetailsMapping}
                  nodeExpandedMapping={nodeExpandedMapping}
                  handleToggleExpandTree={handleToggleExpandTree}
                  handleClickTreeItem={handleClickTreeItem}
                  selectedNode={selectedNode}
                />
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

interface AssetTreeTabProps {
  selectedTab: number;
  selectedNode?: TreeNodeInfo;
  nodeIdToIsExpandedMapping: Record<string, boolean>;
  nodeIdToDetailsMapping: any;
  handleClickTreeItem: (nodes: TreeNodeInfo[]) => void;
  toggleExpandTree: (treeNode: TreeNodeInfo) => void;
}

const AssetTreeTab = ({
  selectedTab,
  selectedNode,
  nodeIdToIsExpandedMapping,
  nodeIdToDetailsMapping,
  handleClickTreeItem,
  toggleExpandTree,
}: AssetTreeTabProps) => {
  const { t } = useTranslation();

  const getAssetTreeNodeInfoListRootByDomainApi = useGetAssetTreeNodeInfoListRootByDomain(
    {
      selectedTab,
    }
  );

  const getAssetTreeNodeInfoListRootByDomainApiData =
    getAssetTreeNodeInfoListRootByDomainApi.data
      ?.retrieveTreeNodeInfoListRootByDomainResult?.records;

  const handleToggleExpandTree = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    treeNode: TreeNodeInfo
  ) => {
    toggleExpandTree(treeNode);
    event.stopPropagation();
  };

  const { isFetching } = getAssetTreeNodeInfoListRootByDomainApi;

  const { isError } = getAssetTreeNodeInfoListRootByDomainApi;

  if (isFetching || isError) {
    return (
      <TabPanel value={selectedTab} index={2}>
        <Box p={2} height={150}>
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item>
              {isFetching && <CircularProgress />}

              {isError && (
                <TransitionErrorMessage in={!isFetching && isError} />
              )}
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    );
  }

  return (
    <TabPanel value={selectedTab} index={2}>
      {!getAssetTreeNodeInfoListRootByDomainApiData ? (
        <MessageBlock height={125}>
          <Box>
            <StyledNavMenuItemIcon
              as={StyledEmptyTreeFolderIcon}
              size="large"
            />
          </Box>
          <LargeBoldDarkText>
            {t('ui.assetnav.noAssetTreeFound', 'No tree items found')}
          </LargeBoldDarkText>
        </MessageBlock>
      ) : (
        <nav aria-label="Asset tree items nav">
          {getAssetTreeNodeInfoListRootByDomainApiData.map((item) => {
            const nodeMapping = nodeIdToDetailsMapping;
            return (
              <TreeItem
                key={item.breadCrumb!}
                depth={0}
                node={item}
                nodePath={[item]}
                nodeDetailsMapping={nodeMapping}
                nodeExpandedMapping={nodeIdToIsExpandedMapping}
                handleToggleExpandTree={handleToggleExpandTree}
                handleClickTreeItem={handleClickTreeItem}
                selectedNode={selectedNode}
              />
            );
          })}
        </nav>
      )}
    </TabPanel>
  );
};

export default AssetTreeTab;
