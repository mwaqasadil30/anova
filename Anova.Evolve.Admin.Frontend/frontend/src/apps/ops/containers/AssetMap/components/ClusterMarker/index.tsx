import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  AssetMapDataChannelInfo,
  EvolveAssetLocationDto,
  EvolveAssetMapAssetInfoRecord,
} from 'api/admin/api';
import React from 'react';
import { FlyToInterpolator, Marker } from 'react-map-gl';
import styled from 'styled-components';
import { getTankColorForInventoryStatus } from 'utils/ui/helpers';

const useCustomMarkerStyle = makeStyles(() =>
  createStyles({
    positionedText: {
      zIndex: 1,
      color: '#333333',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '18px',
      fontWeight: 600,
    },
    markerButton: {
      zIndex: 0,
      '&:focus': {
        outline: 'none',
      },
    },
  })
);

const ClusterMarkerIcon = styled(({ size, ...props }) => <Marker {...props} />)`
  ${(props) => {
    return (
      props.size &&
      `color: #333333;
      background: #fff;
      border-radius: 50%;
      padding: 10px;
      box-sizing: border-box;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      border: 8px solid rgb(56, 147, 255);
      box-shadow: 1px 1px 6px rgba(0,0,0,0.25);
      width: ${props.size}px;
      height: ${props.size}px;
      justify-content: center;
      align-items: center;`
    );
  }}
`;

const clusterPieChartSlices = (clusterLeaves: any) => {
  let totalDataChannels = 0;
  const counts: number[] = [];
  const uniqueValues: string[] = [];
  let prev: string;
  // const numberOfSegments = getSiteAssetsLength(site);
  const extractedAssets: EvolveAssetLocationDto[] = [];
  clusterLeaves?.forEach((site: EvolveAssetLocationDto) => {
    site?.assets?.forEach((siteAsset: EvolveAssetMapAssetInfoRecord) => {
      extractedAssets.push(siteAsset);
    });
  });
  const extractedDataChannels: AssetMapDataChannelInfo[] = [];
  extractedAssets?.forEach((asset: EvolveAssetMapAssetInfoRecord) => {
    asset?.dataChannels?.forEach((dataChannel: AssetMapDataChannelInfo) => {
      extractedDataChannels.push(dataChannel);
      totalDataChannels += 1;
    });
  });

  const statusColors = extractedDataChannels.map((dc) => {
    return getTankColorForInventoryStatus(dc.eventInventoryStatusId);
  });
  const sortedStatusColors = statusColors?.sort();
  sortedStatusColors?.forEach((stat) => {
    if (stat !== prev) {
      uniqueValues.push(stat);
      counts.push(1);
    } else {
      // eslint-disable-next-line no-plusplus
      counts[counts.length - 1]++;
    }
    prev = stat;
  });

  const percentagesAndFills = counts.map((c, i) => {
    const percent = c / sortedStatusColors.length;
    const color = uniqueValues[i];
    return { percent, color };
  });
  const percentagesFillsAndCumulative = percentagesAndFills.map(
    (paf, i, arr) => {
      const { percent, color } = paf;
      let cumulativePercent = 0;
      if (i > 0) {
        // eslint-disable-next-line no-plusplus
        for (let j = 1; j <= i; j++) {
          const prevItem = arr[j - 1];
          cumulativePercent += prevItem.percent;
        }
      }
      return { percent, color, cumulativePercent };
    }
  );
  return {
    totalDataChannels,
    percentagesFillsAndCumulative,
  };
};

const getCoordinatesForPercent = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

interface Slice {
  cumulativePercent: number;
  percent: number;
  color: string;
}

const SvgSlice = ({ percent, color, cumulativePercent }: Slice) => {
  const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
  const endPercent = cumulativePercent + percent;
  const [endX, endY] = getCoordinatesForPercent(endPercent);
  const largeArcFlag = percent > 0.5 ? 1 : 0;
  const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
  return <path fill={color} d={pathData} />;
};

interface Props {
  latitude: any;
  longitude: any;
  supercluster: any;
  cluster: any;
  setMapState: any;
  // TODO: Replace this 'any' with proper type
  getBoundsForPoints: any;
  mapWidth: number;
  mapHeight: number;
}

const ClusterMarker = ({
  latitude,
  longitude,
  supercluster,
  cluster,
  setMapState,
  getBoundsForPoints,
  mapWidth,
  mapHeight,
}: Props) => {
  const classes = useCustomMarkerStyle();

  const {
    percentagesFillsAndCumulative: allClusterPieChartSlices,
    totalDataChannels,
  } = clusterPieChartSlices(supercluster.getLeaves(cluster.id, -1));

  const makeClusterSize = () => {
    if (totalDataChannels && totalDataChannels.toString().length === 2) {
      return 40;
    }
    if (totalDataChannels && totalDataChannels.toString().length === 1) {
      return 40;
    }
    return 60;
  };
  const clusterSize = makeClusterSize();

  return (
    <ClusterMarkerIcon
      size={clusterSize}
      latitude={latitude}
      longitude={longitude}
      offsetLeft={-20}
      offsetTop={-60}
    >
      <button
        className={classes.markerButton}
        type="button"
        style={{
          position: 'relative',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
        }}
        onClick={() => {
          const leaves = supercluster.getLeaves(cluster.id, -1);
          const clusteredPoints = leaves.map((leaf: any) => {
            return {
              long: leaf.longitude,
              lat: leaf.latitude,
            };
          });
          const { zoom } = getBoundsForPoints(
            clusteredPoints,
            mapWidth,
            mapHeight
          );

          setMapState({
            viewport: {
              latitude,
              longitude,
              zoom: zoom * 0.975,
              transitionInterpolator: new FlyToInterpolator({
                speed: 3,
              }),
              transitionDuration: 'auto',
            },
          });
        }}
      >
        <svg
          data-name="map-marker"
          xmlns="http://www.w3.org/2000/svg"
          width={clusterSize}
          height={clusterSize}
          viewBox="-1 -1 2 2"
          // style={{
          //   position: 'absolute',
          //   left: '50%',
          //   transform: 'translateX(-50%)',
          //   top: '-46px',
          // }}
        >
          <g>
            {allClusterPieChartSlices?.map((slice, keyTwo) => (
              <SvgSlice
                key={keyTwo}
                percent={slice.percent}
                color={slice.color}
                cumulativePercent={slice.cumulativePercent}
              />
            ))}
            {/* {demoPieChartSlices()?.map((slice, keyTwo) => (
                      <SvgSlice
                        key={keyTwo}
                        percent={slice.percent}
                        color={slice.color}
                        cumulativePercent={slice.cumulativePercent}
                      />
                    ))} */}
            <circle cx="0" cy="0" r="0.75" style={{ fill: '#fff' }} />
          </g>
        </svg>
        <span className={classes.positionedText}>
          {/* {cluster.properties.point_count} */}
          {totalDataChannels}
        </span>
        <svg
          id="f26aa82e-f054-4c52-8ae4-2f75da1a0d6b"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          width={clusterSize * 1.6}
          height={clusterSize * 1.6}
          viewBox="0 0 3 3"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <g>
            <path
              d="M1.5.44A1.06,1.06,0,1,1,.44,1.5,1.07,1.07,0,0,1,1.5.44m0-.1A1.16,1.16,0,1,0,2.66,1.5,1.16,1.16,0,0,0,1.5.34Z"
              style={{ fill: '#fff', opacity: '0.6' }}
            />
            <g style={{ opacity: '0.4' }}>
              <path
                d="M.3,1.5A1.18,1.18,0,0,1,.5.83L.41.77a1.32,1.32,0,0,0,0,1.46L.5,2.17A1.18,1.18,0,0,1,.3,1.5Z"
                style={{ fill: '#fff' }}
              />
            </g>
            <g style={{ opacity: '0.4' }}>
              <path
                d="M2.7,1.5A1.18,1.18,0,0,0,2.5.83L2.59.77a1.32,1.32,0,0,1,0,1.46L2.5,2.17A1.18,1.18,0,0,0,2.7,1.5Z"
                style={{ fill: '#fff' }}
              />
            </g>
          </g>
        </svg>
      </button>
    </ClusterMarkerIcon>
  );
};

export default ClusterMarker;
